import React from 'react';
import { populateDataBase } from '../services/PopulateDbService';
import LoadingDialog from '../components/LoadingDialog';

class PopulateDB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  async populate(event) {
    event.preventDefault();
    try {
      this.setState({ loading: true });
      const response = await populateDataBase();
      console.log('rep : ', response);
      if (response.status == 201) {
        alert("Base de données rempli avec succès !");
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
      return (
        <div>
          {this.state.loading && <LoadingDialog />}

          <h1>Remplir la bdd</h1>
          <p>/!\ Attention /!\</p>
          <p>Remplir la bdd va supprimer toutes les données existantes<br></br>
          et remplir la base de données avec de nouvelles données.</p>

          <p>Soyez sûr que vous pouvez faire cela sans perdre de<br></br>   
          données importantes ou déranger le bon fonctionnement<br></br>  
          du site web/de l’application mobile.</p>      

          <button onClick={(event) => this.populate(event)}>Remplir</button>
        </div>
      );
    }
}

export default PopulateDB;
