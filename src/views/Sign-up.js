import React from 'react';
import { Link } from 'react-router-dom';
import { getDepartments } from '../services/DepartmentService';
import { addCustomer } from '../services/CustomerService';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      formData: {
        mail: '',
        password: '',
        firstname: '',
        lastname: '',
        zipCode: '',
        address: '',
        town: '',
        departmentId: '1'
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  async componentDidMount() {
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
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  }

  async submit(event) {
    event.preventDefault();
    const { mail, password, firstname, lastname, zipCode, address, town, departmentId } = this.state.formData;
    try {
      const response = await addCustomer(mail, password, firstname, lastname, zipCode, address, town, departmentId);
      
      if (response.success) {
        alert("Votre compte a été créé avec succès, veuillez vous connecter");
        this.props.navigate('/connexion');
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  render() {
    return (
      <div className="flex items-center justify-center mt-[3rem] mb-[3rem]">
        <div className="bg-custom-secondary_color rounded-lg p-6 w-[30rem]">
          <h1 className="text-[2rem] font-bold pt-[2rem] pb-[1rem] text-white text-center">S'inscrire</h1>
  
          <form onSubmit={this.submit} className="max-w-sm mx-auto">
            <div className="mb-4">
              <label htmlFor="firstname" className="block mb-1 text-white text-left">Prénom (*):</label>
              <input 
                type="text" 
                id="firstname" 
                name="firstname" 
                value={this.state.formData.firstname} 
                onChange={this.handleChange} 
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="lastname" className="block mb-1 text-white text-left">Nom (*):</label>
              <input 
                type="text" 
                id="lastname" 
                name="lastname" 
                value={this.state.formData.lastname} 
                onChange={this.handleChange} 
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="mail" className="block mb-1 text-white text-left">Email (*):</label>
              <input 
                type="email" 
                id="mail" 
                name="mail" 
                value={this.state.formData.mail} 
                onChange={this.handleChange} 
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="password" className="block mb-1 text-white text-left">Mot de passe (*):</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={this.state.formData.password} 
                onChange={this.handleChange} 
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="zipCode" className="block mb-1 text-white text-left">Code Postal (*):</label>
              <input 
                type="number" 
                id="zipCode" 
                name="zipCode" 
                value={this.state.formData.zipCode} 
                onChange={this.handleChange} 
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                min="1000" 
                max="98999"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="address" className="block mb-1 text-white text-left">Adresse (*):</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                value={this.state.formData.address} 
                onChange={this.handleChange} 
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="town" className="block mb-1 text-white text-left">Ville (*):</label>
              <input 
                type="text" 
                id="town" 
                name="town" 
                value={this.state.formData.town} 
                onChange={this.handleChange} 
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="departmentId" className="block mb-1 text-white text-left">Département (*):</label>
              <select 
                id="departmentId" 
                name="departmentId" 
                value={this.state.formData.departmentId} 
                onChange={this.handleChange} 
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500">
                {this.state.departments.map(department => (
                  <option key={department.id} value={department.id}>
                    {String(department.id).padStart(2, '0')} - {department.name}
                  </option>
                ))}
              </select>
            </div>
  
            <button type="submit" className="w-full bg-custom-primary_color hover:bg-custom-hover_effect text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">
              S'inscrire
            </button>
          </form>
  
          <p className="mt-4 text-white"> Vous avez déjà un compte ? <Link to="/connexion" className="text-custom-hover_effect hover:underline">Connectez-vous</Link></p>
        </div>
      </div>
    );
  }
}

export default SignUp;
