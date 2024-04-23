import { Component } from '@angular/core';
import { Skills } from '../models/skills';
import { CandidateSkills } from '../models/candidate-skills';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-master-view',
  templateUrl: './master-view.component.html',
  styleUrl: './master-view.component.css'
})
export class MasterViewComponent {
  skillList: Skills[] = [];
  candidateList: CandidateSkills[] = [];
 baseUrl='http://localhost:5203/';
 imageUrl:string=this.baseUrl+'Images/'
  constructor(
    private dataSvc: DataService,
    private router: Router
  ) { }
 
  ngOnInit(): void {
 
    this.dataSvc.getSkillList().subscribe(x => {
      this.skillList = x;
    });
    this.dataSvc.getCandidateSkill().subscribe(x => {
      this.candidateList = x;
    });
  }
 
  getSkillName(id: any) {
    let data = this.skillList.find(x => x.skillId == id);
    return data ? data.skillName : '';
  }
  OnDelete(item: CandidateSkills):void {
    if (item.candidateId){
      this.dataSvc.deleteCandidateSkill(item.candidateId).subscribe({
        next: (response) => {
          let currentUrl = this.router.url;
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate([currentUrl]);
            });
        }
      })
    }
    ;
  }
}
