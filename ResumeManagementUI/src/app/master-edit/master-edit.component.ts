import { Component } from '@angular/core';
import { Skills } from '../models/skills';
import { CandidateSkills } from '../models/candidate-skills';
import { DataService } from '../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-master-edit',
  templateUrl: './master-edit.component.html',
  styleUrl: './master-edit.component.css'
})
export class MasterEditComponent {
  skillList: Skills[] = [];
  candidatePicture: File = null!;

  /*candidateSkill: CandidateSkills = { 
    candidateId: undefined, 
    candidateName: undefined, 
    mobileNo: undefined, 
    picture: undefined, 
    isFresher: undefined }*/

    candidateSkill: CandidateSkills = { 
      candidateId: 0, 
      candidateName:'', 
      mobileNo: '', 
      picture: '', 
      isFresher: false }

  url = '/assets/img/no_image.png';
  baseUrl='http://localhost:5203/';
  imageUrl:string=this.baseUrl+'Images/'
  constructor(
    public dataSvc: DataService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    
  ) { }

  candidateForm: FormGroup = new FormGroup({
    candidateId: new FormControl(undefined, Validators.required),
    candidateName: new FormControl(undefined, Validators.required),
    dateOfBirth: new FormControl(undefined),
    mobileNo: new FormControl(undefined, Validators.required),
    isFresher: new FormControl(undefined, Validators.required),
    skillsList: new FormArray([])
  });

  get SkillListArray() {
    return this.candidateForm.controls["skillsList"] as FormArray;
  }

  addSkill(item?: Skills) {
    if (item) {
      this.SkillListArray.push(new FormGroup({
        skillId: new FormControl(item.skillId, Validators.required)
      }));
    } else {
      this.SkillListArray.push(new FormGroup({
        skillId: new FormControl(undefined, Validators.required)
      }));
    }

  }

  removeSkill(index: number) {
    if (this.SkillListArray.controls.length > 0)
      this.SkillListArray.removeAt(index);
  }

  ngOnInit() {
    const id = this.activatedRouter.snapshot.params['id'];

    this.dataSvc.getCandidateSkillById(id).subscribe(x => {
      this.candidateSkill = x;
     
      this.candidateForm.patchValue(this.candidateSkill);
     
      this.candidateSkill=this.candidateSkill;
      if (x.dateOfBirth) {
        const dateOfBirth = new Date(x.dateOfBirth);
        const formattedBirthDate = dateOfBirth.toISOString().substring(0, 10);

        this.candidateForm.patchValue({
          dateOfBirth: formattedBirthDate
        });
      }

      this.candidateSkill.skillList?.forEach(item => {
        this.addSkill(item);
      });

    });

    this.dataSvc.getSkillList().subscribe((result) => {
      this.skillList = result;
    });
  }

  onFileSelected(event: any) {
    this.candidatePicture = event.target.files[0];
  }

  UpdateCandidateData() {

    var formData = new FormData();
    formData.append("skillStringify", JSON.stringify(this.candidateForm.get("skillsList")?.value));
    formData.append("candidateId", this.candidateForm.get("candidateId")?.value);
    formData.append("candidateName", this.candidateForm.get("candidateName")?.value);
    formData.append("dateOfBirth", this.candidateForm.get("dateOfBirth")?.value);
    formData.append("mobileNo", this.candidateForm.get("mobileNo")?.value);
    formData.append("isFresher", this.candidateForm.get("isFresher")?.value);
    if (this.candidatePicture) {
      formData.append("pictureFile", this.candidatePicture, this.candidatePicture.name);
    }

    this.dataSvc.updateCandidateSkill(formData).subscribe(
      {
        next: r => {
          console.log(r);
          this.router.navigate(['/masterdetails']);          
        },
        error: err => {
          console.log(err);
        }
      }
    );

  }
}
