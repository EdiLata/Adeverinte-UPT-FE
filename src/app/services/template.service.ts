import {DestroyRef, inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Specialization} from '../enums/specialization.enum';
import {BehaviorSubject} from 'rxjs';
import {SafeHtml} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private readonly http = inject(HttpClient);

  private viewModalContentSource = new BehaviorSubject<SafeHtml | null>(null);

  public setViewModalContent(content: SafeHtml) {
    this.viewModalContentSource.next(content);
  }

  public getViewModalContent() {
    return this.viewModalContentSource.asObservable();
  }

  public uploadTemplate(formData: any) {
    console.log(formData);
    return this.http.post<any>(
      `http://localhost:3000/templates/upload`,
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

  public downloadTemplate(template: string) {
    return this.http.get<any>(
      `http://localhost:3000/templates/download/${template}`,
      {responseType: 'blob' as 'json'},
    );
  }
}
