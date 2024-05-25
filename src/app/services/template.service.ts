import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Specialization} from '../enums/specialization.enum';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private readonly http = inject(HttpClient);

  public uploadTemplate(formData: any) {
    console.log(formData);
    return this.http.post<any>(
      `http://localhost:3000/templates/upload`,
      formData,
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
