import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Specialization} from '../enums/specialization.enum';
import {BehaviorSubject} from 'rxjs';
import {SafeHtml} from '@angular/platform-browser';
import {ResponseStatus} from '../enums/response-status.enum';
import {Faculty} from '../enums/faculty.enum';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private readonly http = inject(HttpClient);

  private templatesSource = new BehaviorSubject<any>(null);
  private studentResponsesSource = new BehaviorSubject<any>(null);
  private allStudentsResponsesSource = new BehaviorSubject<any>(null);

  private addModalSource = new BehaviorSubject<boolean>(false);
  private generateReportModalSource = new BehaviorSubject<boolean>(false);
  private viewModalContentSource = new BehaviorSubject<SafeHtml | null>(null);
  private deleteModalSource = new BehaviorSubject<number | null>(null);
  private editModalSource = new BehaviorSubject<number | null>(null);
  private approveModalSource = new BehaviorSubject<number | null>(null);
  private declineModalSource = new BehaviorSubject<number | null>(null);
  private redoModalSource = new BehaviorSubject<number | null>(null);

  public setGenerateReportModal(isOpened: boolean): void {
    this.generateReportModalSource.next(isOpened);
  }

  public getGenerateReportModal() {
    return this.generateReportModalSource.asObservable();
  }

  public setApproveModal(id: number): void {
    this.approveModalSource.next(id);
  }

  public getApproveModal() {
    return this.approveModalSource.asObservable();
  }

  public setDeclineModal(id: number): void {
    this.declineModalSource.next(id);
  }

  public getDeclineModal() {
    return this.declineModalSource.asObservable();
  }

  public setRedoModal(id: number): void {
    this.redoModalSource.next(id);
  }

  public getRedoModal() {
    return this.redoModalSource.asObservable();
  }

  public setAllStudentsResponsesSource(responses: any): void {
    this.allStudentsResponsesSource.next(responses);
  }

  public getAllStudentsResponsesSource() {
    return this.allStudentsResponsesSource.asObservable();
  }

  public setStudentResponsesSource(responses: any): void {
    this.studentResponsesSource.next(responses);
  }

  public getStudentResponsesSource() {
    return this.studentResponsesSource.asObservable();
  }

  public setAddModal(isOpened: boolean): void {
    this.addModalSource.next(isOpened);
  }

  public getAddModal() {
    return this.addModalSource.asObservable();
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

  public fillTemplate(formData: any) {
    return this.http.post<any>(
      `http://localhost:3000/templates/fill`,
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

  public deleteStudentResponse(studentResponseId: number) {
    return this.http.delete<any>(
      `http://localhost:3000/templates/student-responses/${studentResponseId}`,
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

  public getAllStudentsResponses(
    status?: ResponseStatus,
    faculties?: Faculty[],
    specializations?: Specialization[],
    years?: number[],
    page?: number,
    limit?: number,
  ) {
    let params = new HttpParams();
    if (status) {
      params = params.append('status', status);
    }

    if (faculties && faculties.length > 0) {
      faculties.forEach((faculty) => {
        params = params.append('faculties', faculty);
      });
    }

    if (specializations && specializations.length > 0) {
      specializations.forEach((specialization) => {
        params = params.append('specializations', specialization);
      });
    }

    if (years && years.length > 0) {
      years.forEach((year) => {
        params = params.append('years', year);
      });
    }

    if (page) {
      params = params.append('page', page);
    }

    if (limit) {
      params = params.append('limit', limit);
    }
    return this.http.get<any>(
      `
    http://localhost:3000/templates/students-responses/with-user-details/all`,
      {params},
    );
  }

  public getStudentResponses(studentId: number) {
    return this.http.get<any>(
      `http://localhost:3000/templates/student-responses/by-student-id/${studentId}`,
    );
  }

  public getStudentResponse(studentResponseId: number) {
    return this.http.get<any>(
      `http://localhost:3000/templates/student-responses/${studentResponseId}`,
    );
  }

  public getApprovedResponses(dateRange: any) {
    let params = new HttpParams();
    for (const key in dateRange) {
      if (dateRange.hasOwnProperty(key)) {
        params = params.append(key, dateRange[key]);
      }
    }

    return this.http.get<any>(
      `
    http://localhost:3000/templates/students-responses/with-user-details/approved`,
      {params},
    );
  }

  public editStudentResponse(studentResponseId: number, formData: any) {
    return this.http.put<any>(
      `http://localhost:3000/templates/student-responses/${studentResponseId}`,
      formData,
    );
  }

  public updateStudentResponseStatus(studentResponseId: number, formData: any) {
    return this.http.patch<any>(
      `http://localhost:3000/templates/${studentResponseId}/status`,
      formData,
    );
  }

  public getTemplateFields(templateId: number) {
    return this.http.get<any>(
      `http://localhost:3000/templates/fields/${templateId}`,
    );
  }

  public downloadTemplate(template: string) {
    return this.http.get<any>(
      `http://localhost:3000/templates/download/${template}`,
      {responseType: 'blob' as 'json'},
    );
  }
}
