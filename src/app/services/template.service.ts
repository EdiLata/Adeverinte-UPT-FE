import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Specialization} from '../enums/specialization.enum';
import {BehaviorSubject} from 'rxjs';
import {SafeHtml} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private readonly http = inject(HttpClient);

  private templatesSource = new BehaviorSubject<any>(null);
  private studentResponsesSource = new BehaviorSubject<any>(null);

  private viewModalContentSource = new BehaviorSubject<SafeHtml | null>(null);
  private deleteModalSource = new BehaviorSubject<number | null>(null);
  private editModalSource = new BehaviorSubject<number | null>(null);

  public setStudentResponsesSource(responses: any): void {
    this.studentResponsesSource.next(responses);
  }

  public getStudentResponsesSource() {
    return this.studentResponsesSource.asObservable();
  }

  public setEditModal(id: number): void {
    this.editModalSource.next(id);
  }

  public getEditModal() {
    return this.editModalSource.asObservable();
  }

  public setTemplatesSource(templates: any): void {
    this.templatesSource.next(templates);
  }

  public getTemplatesSource() {
    return this.templatesSource.asObservable();
  }

  public setDeleteModal(id: number): void {
    this.deleteModalSource.next(id);
  }

  public getDeleteModal() {
    return this.deleteModalSource.asObservable();
  }

  public setViewModalContent(content: SafeHtml) {
    this.viewModalContentSource.next(content);
  }

  public getViewModalContent() {
    return this.viewModalContentSource.asObservable();
  }

  public uploadTemplate(formData: any) {
    return this.http.post<any>(
      `http://localhost:3000/templates/upload`,
      formData,
    );
  }

  public getTemplate(id: number) {
    return this.http.get<any>(`http://localhost:3000/templates/${id}`);
  }

  public editTemplate(id: number, formData: any) {
    return this.http.put<any>(
      `http://localhost:3000/templates/${id}`,
      formData,
    );
  }

  public getFileUrl(name: string) {
    return this.http.get<{html: string}>(
      `http://localhost:3000/templates/get-doc-html/${name}`,
    );
  }

  public deleteTemplate(templateId: number) {
    return this.http.delete<any>(
      `http://localhost:3000/templates/${templateId}`,
    );
  }

  public getTemplates(specializations?: Specialization[]) {
    let params = new HttpParams();
    if (specializations && specializations.length > 0) {
      specializations.forEach((specialization) => {
        params = params.append('specializations', specialization);
      });
    }
    return this.http.get<any>(`http://localhost:3000/templates`, {params});
  }

  public getStudentResponses(studentId: number) {
    return this.http.get<any>(
      `http://localhost:3000/templates/student-responses/${studentId}`,
    );
  }

  public downloadTemplate(template: string) {
    return this.http.get<any>(
      `http://localhost:3000/templates/download/${template}`,
      {responseType: 'blob' as 'json'},
    );
  }
}
