import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { UserService } from './services/user.service';
import { User } from './services/user.interface';
import { DbOperation } from './services/dbOperation';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'AngularRegistrationForm';
  // registerForm: FormGroup = new FormGroup ({});
  registerForm!: FormGroup;
  users: User[] = [];
  submitted: boolean = false;
  buttonText: string = 'Submit';
  dbOps: any = DbOperation;

  constructor(
    private _toastr: ToastrService,
    private _fb: FormBuilder,
    private _userService: UserService
  ) {}

  ngOnInit() {
    this.setFormState();
    this.getAllUsers();
  }

  setFormState() {
    this.buttonText = 'Submit';
    this.dbOps = DbOperation.create;

    this.registerForm = this._fb.group({
      id: [0],
      title: ['', Validators.required],
      firstName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ]),
      ],
      lastName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ]),
      ],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      dob: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
          ),
        ]),
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      confirmPassword: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      acceptTerms: [false, Validators.required],
    });
  }

  get f() {
    return this.registerForm.controls;
}

  onSubmit() {
    this.submitted = true;

    console.log(this.registerForm.value);
    switch (this.dbOps) {
      case DbOperation.create:
        this._userService.addUser(this.registerForm.value).subscribe((res) => {
          this._toastr.success('User Added Successfully', 'User Added');
          this.getAllUsers();
          this.onCancel();
        });
        break;
      case DbOperation.update:
        this._userService
          .updateUser(this.registerForm.value)
          .subscribe((res) => {
            this._toastr.success('User Updated Successfully', 'User Update');
            this.getAllUsers();
            this.onCancel();
          });
        break;
    }
  }

  onCancel() {
    this.registerForm.reset();
    this.buttonText = 'Submit';
    this.dbOps = DbOperation.create;
    this.submitted = false;
  }

  getAllUsers() {
    this._userService.getUsers().subscribe((res: any) => {
      this.users = res;
      console.log(res);
    });
  }

  edit(userId: number) {
    this.buttonText = 'Update';
    this.dbOps = DbOperation.update;
    let user = this.users.find((u: User) => u.id === userId);
    // this.registerForm.patchValue(user);
  }

  delete(userId: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._userService.deleteUsers(userId).subscribe((res) => {
            this.getAllUsers();
            swalWithBootstrapButtons.fire({
              title: 'Deleted!',
              text: 'Your file has been deleted.',
              icon: 'success',
            });
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelled',
            text: 'Your imaginary file is safe :)',
            icon: 'error',
          });
        }
      });
  }
}
