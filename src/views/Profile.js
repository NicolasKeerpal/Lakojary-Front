import React from 'react';
import { getCustomer } from '../services/CustomerService';
import { getEmployee } from '../services/EmployeeService';
import { getDepartments } from '../services/DepartmentService';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          firstname: '',
          lastname: '',
          mail: '',
          zipCode: '',
          town: '',
          address: '',
          endContract: '',
          salary: '',
          departmentId: '',
          departments: [],
          role: null
        };
        this.logout = this.logout.bind(this);
      }

    async componentDidMount() {
      const token = localStorage.getItem('token');
      let decoded;
      if (token) {
        try {
          decoded = jwtDecode(token);
          this.setState({ role: decoded.role });
        } catch (error) {
          alert("Une erreur est survenue");
          this.props.navigate('/home');
        }
      }
  
      try {
          let userData, firstname, lastname, mail, address, town, zipCode, salary, endContract, departmentId;
          if (decoded.role == 'client') {
            /*userData = await getCustomer(decoded.id);
            firstname = userData.data.customerId.firstname;
            lastname = userData.data.customerId.lastname;
            mail = userData.data.customerId.mail;
            address = userData.data.address;
            town = userData.data.town;
            zipCode = userData.data.zipCode;*/
            userData = true;
            firstname = "firstname";
            lastname = "lastname";
            mail = "customerId.mail";
            address = "address";
            town = "userData.data.town";
            zipCode = "zipCode";
          } else {
            try {
              const departmentsData = await getDepartments();
              if (departmentsData.success) {
                this.setState({ departments: departmentsData.data });
              } else {
                alert('Une erreur est survenue');
              }
            } catch (error) {
              alert('Une erreur est survenue');
            }

            userData = await getEmployee(decoded.id);
            firstname = userData.data.employeeId.firstname;
            lastname = userData.data.employeeId.lastname;
            mail = userData.data.employeeId.mail;
            salary = userData.data.salary;
            endContract = userData.data.endConract;
            departmentId = userData.data.departmentId;
          }
          
          if (userData.success) {
              this.setState({ 
                  firstname,
                  lastname,
                  mail,
                  salary,
                  endContract,
                  address,
                  town,
                  zipCode,
                  departmentId,
              });
          }
      } catch(error) {
          console.log(error);
          alert("Une erreur est survenue");
          this.props.navigate('/');
      }
    }

    formatDate(dateStr) {
      const dateObj = new Date(dateStr);
  
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');;
      const day = String(dateObj.getDate()).padStart(2, '0');
  
      const formattedDate = `${day}/${month}/${year}`;
  
      return formattedDate;
    }

    logout = () => {
      localStorage.removeItem('token');
      this.props.navigate('/connexion');
      window.location.reload();
    }
  
    render() {
      const { firstname, lastname, mail, role, endContract, salary, town, address, zipCode, departments, departmentId } = this.state;
      let roleContent = "Client";
      let infoContent = ( <div>
        <div>
            <div>
                <p>Mail</p>
                <div>
                    <p>{mail}</p>
                </div>
            </div>
            <div>
                <p>Adresse</p>
                <div>
                    <p>{address}</p>
                </div>
            </div>
        </div>
        <div>
          <div>
              <p>Code postal</p>
              <div>
                  <p>{zipCode}</p>
              </div>
          </div>
          <div>
              <p>Ville</p>
              <div>
                  <p>{town}</p>
              </div>
          </div>
      </div>
      </div> );
      let buttons = ( <div>
              <button to={'/profil/edit'}>Modifier</button>
              <button>Supprimer</button>
              <button onClick={this.logout}>Déconnexion</button>
      </div>);

      if (role!="client") {
        let department = departments[departmentId-1];
        roleContent = "Employé - " + role;
        infoContent = ( <div>
          <div>
              <div>
                  <p>Mail</p>
                  <div>
                      <p>{mail}</p>
                  </div>
              </div>
              <div>
                  <p>Département</p>
                  <div>
                      <p>{departmentId} - {department ? department.name : 'Error'}</p>
                  </div>
              </div>
          </div>
          <div>
            <div>
                <p>Fin de contrat</p>
                <div>
                    <p>{endContract ? this.formatDate(endContract) : 'Indeterminé'}</p>
                </div>
            </div>
            <div>
                <p>Salaire</p>
                <div>
                    <p>{salary} €</p>
                </div>
            </div>
        </div>
        </div> );
        buttons = ( <div>
          <Link to={'/profil/edit'}><button>Modifier</button></Link>
          <button onClick={this.logout}>Déconnexion</button>
        </div>);
      }

      return (
        <div>
            <div>
              <h1>Profil</h1>
              <div>
                <h1>{firstname} {lastname}</h1>
                <p>{roleContent}</p>
                <div>
                    <div>
                        <div>
                            <p>First Name</p>
                            <div>
                                <p>{firstname}</p>
                            </div>
                        </div>
                        <div>
                            <p>Last Name</p>
                            <div>
                                <p>{lastname}</p>
                            </div>
                        </div>
                    </div>
                    {infoContent}

                {buttons}
            </div>        
          </div>
          </div>
          </div>
      );
    }
}

export default Profile;