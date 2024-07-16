import React from 'react';
import { getCustomer, delCustomer } from '../services/CustomerService';
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
      role: null,
    };
    this.logout = this.logout.bind(this);
  }

    async componentDidMount() {
      const token = localStorage.getItem('token');
      let decoded;
      if (token) {
        try {
          decoded = jwtDecode(token);
          console.log(decoded.id);
          this.setState({ role: decoded.role });
        } catch (error) {
          alert("Une erreur est survenue");
          this.props.navigate('/home');
        }
      }
  
      try {
          let userData, firstname, lastname, mail, address, town, zipCode, salary, endContract, departmentId;
          if (decoded.role == 'client') {
            userData = await getCustomer(decoded.id);
            firstname = userData.data.customerId.firstname;
            lastname = userData.data.customerId.lastname;
            mail = userData.data.customerId.mail;
            address = userData.data.address;
            town = userData.data.town;
            zipCode = userData.data.zipCode;
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
          if (userData.success) {
            this.setState({
              firstname: userData.data.employeeId.firstname,
              lastname: userData.data.employeeId.lastname,
              mail: userData.data.employeeId.mail,
              salary: userData.data.salary,
              endContract: userData.data.endContract,
              departmentId: userData.data.departmentId,
            });
          }
        }
      } catch (error) {
        alert('Une erreur est survenue');
        this.props.navigate('/home');
      }
    }
  }

  formatDate(dateStr) {
    const dateObj = new Date(dateStr);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

    logout = () => {
      localStorage.removeItem('token');
      this.props.navigate('/connexion');
      window.location.reload();
    }
  
    async deleteProfile(event) {
      event.preventDefault();
      const token = localStorage.getItem('token');
      let decoded;
      if (token) {
        try {
          decoded = jwtDecode(token);
          console.log(decoded.id);
          this.setState({ role: decoded.role });
        } catch (error) {
          alert("Une erreur est survenue");
          this.props.navigate('/home');
        }
      }

      try {
        const response = await delCustomer(decoded.id);
        
        if (response.status == 204) {
          alert("Votre profil a bien été supprimé !");
          this.logout();
        } else {
          alert(response.message);
        }
      } catch (error) {
        alert("Une erreur est survenue");
      }
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
            <div className="flex-1">
              <p className="text-white font-semibold">Adresse</p>
              <div className="border-4 border-custom-secondary_color bg-transparent text-white p-2 rounded">
                <p>{address}</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <div className="flex-1">
              <p className="text-white font-semibold">Code postal</p>
              <div className="border-4 border-custom-secondary_color bg-transparent text-white p-2 rounded">
                <p>{zipCode}</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">Ville</p>
              <div className="border-4 border-custom-secondary_color bg-transparent text-white p-2 rounded">
                <p>{town}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div> );
      let buttons = ( <div>
              <Link to={'/profil/edit'}><button>Modifier</button></Link>
              <button onClick={(event) => this.deleteProfile(event)}>Supprimer</button>
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
              <div className="flex-1">
                <p className="text-white font-semibold">Département</p>
                <div className="border-4 border-custom-secondary_color bg-transparent text-white p-2 rounded">
                  <p>{departmentId} - {department ? department.name : 'Error'}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <div className="flex-1">
                <p className="text-white font-semibold">Fin de contrat</p>
                <div className="border-4 border-custom-secondary_color bg-transparent text-white p-2 rounded">
                  <p>{endContract ? this.formatDate(endContract) : 'Indeterminé'}</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">Salaire</p>
                <div className="border-4 border-custom-secondary_color bg-transparent text-white p-2 rounded">
                  <p>{salary} €</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center mt-[3rem] mb-[3rem]">
        <div className="bg-[#533619] rounded-lg p-6 w-[30rem]">
          <h1 className="text-3xl font-bold mb-4 text-white">Profil</h1>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{firstname} {lastname}</h1>
            {infoContent}
            <div className="flex space-x-4 items-center justify-center">
              <Link to={'/profil/edit'}>
                <button className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-opacity-75 focus:outline-none">Modifier</button>
              </Link>
              {role !== 'client' && (
                <button className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-opacity-75 focus:outline-none">Supprimer</button>
              )}
              <button onClick={this.logout} className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-opacity-75 focus:outline-none">Déconnexion</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
