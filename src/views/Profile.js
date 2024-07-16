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
            if (decoded.role === 'client') {
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
                firstname = userData.data.employeeId.firstname;
                lastname = userData.data.employeeId.lastname;
                mail = userData.data.employeeId.mail;
                salary = userData.data.salary;
                endContract = userData.data.endContract;
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
        } catch (error) {
            alert("Une erreur est survenue");
            this.props.navigate('/');
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
                this.setState({ role: decoded.role });
            } catch (error) {
                alert("Une erreur est survenue");
                this.props.navigate('/home');
            }
        }

        try {
            const response = await delCustomer(decoded.id);

            if (response.status === 204) {
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
        let infoContent = (
            <div className="mt-4">
                <div className="mb-4">
                    <p className="font-bold text-white">Mail</p>
                    <div className="bg-custom-primary_color p-2 rounded text-white">
                        <p>{mail}</p>
                    </div>
                </div>
                <div className="mb-4">
                    <p className="font-bold text-white">Adresse</p>
                    <div className="bg-custom-primary_color p-2 rounded text-white">
                        <p>{address}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                        <p className="font-bold text-white">Code postal</p>
                        <div className="bg-custom-primary_color p-2 rounded text-white">
                            <p>{zipCode}</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="font-bold text-white">Ville</p>
                        <div className="bg-custom-primary_color p-2 rounded text-white">
                            <p>{town}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    
        let buttons = (
            <div className="flex justify-between mt-6">
                <Link to={'/profil/edit'}>
                    <button className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-custom-hover_effect">Modifier</button>
                </Link>
                <button onClick={this.logout} className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-custom-hover_effect">Déconnexion</button>
            </div>
        );

        if (role !== "client") {
            let department = departments[departmentId - 1];
            roleContent = `Employé - ${role}`;
            infoContent = (
                <div className="mt-4">
                    <div className="mb-4">
                        <p className="font-bold text-white">Mail</p>
                        <div className="bg-custom-primary_color p-2 rounded text-white">
                            <p>{mail}</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="font-bold text-white">Département</p>
                        <div className="bg-custom-primary_color p-2 rounded text-white">
                            <p>{departmentId} - {department ? department.name : 'Error'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <p className="font-bold text-white">Fin de contrat</p>
                            <div className="bg-custom-primary_color p-2 rounded text-white">
                                <p>{endContract ? this.formatDate(endContract) : 'Indeterminé'}</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <p className="font-bold text-white">Salaire</p>
                            <div className="bg-custom-primary_color p-2 rounded text-white">
                                <p>{salary} €</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
            buttons = (
                <div className="flex justify-between mt-6">
                    <Link to={'/profil/edit'}>
                        <button className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-custom-hover_effect">Modifier</button>
                    </Link>
                    <button onClick={this.logout} className="px-4 py-2 bg-custom-primary_color text-white rounded hover:bg-custom-hover_effect">Déconnexion</button>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center mt-4 mb-4">
                <div className="w-full max-w-2xl bg-custom-secondary_color p-8 rounded shadow-lg">
                    <h1 className="text-2xl font-bold mb-2 text-white">Profil</h1>
                    <div className="text-center">
                        <h1 className="text-[2.5rem] font-bold text-white">{firstname} {lastname}</h1>
                        <p className="text-white">{roleContent}</p>
                    </div>
                    <div className="mt-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="font-bold text-white">First Name</p>
                                <div className="bg-custom-primary_color p-2 rounded text-white">
                                    <p>{firstname}</p>
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-white">Last Name</p>
                                <div className="bg-custom-primary_color p-2 rounded text-white">
                                    <p>{lastname}</p>
                                </div>
                            </div>
                        </div>
                        {infoContent}
                        {buttons}
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;
