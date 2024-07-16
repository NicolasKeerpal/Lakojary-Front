import React from 'react';
import { populateDataBase } from '../services/PopulateDbService';
import LoadingDialog from '../components/LoadingDialog';

class PopulateDB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dialogMessage: '',
      showDialog: false,
      showRedirectionDialog: false,
    };
  }

  async populate(event) {
    event.preventDefault();
    try {
      this.setState({ loading: true });
      const response = await populateDataBase();
      console.log('rep : ', response);
      if (response.status === 204) {
        this.setState({ dialogMessage: "Base de données remplie avec succès !", showDialog: true });
      } else {
        this.setState({ dialogMessage: response.message, showDialog: true });
      }
    } catch (error) {
      this.setState({ dialogMessage: "Une erreur est survenue", showDialog: true });
    } finally {
      this.setState({ loading: false });
    }
  }

  closeDialog = () => {
    this.setState({ showDialog: false });
  };

  render() {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-custom-secondary_color shadow-md rounded-lg">
        {this.state.loading && <LoadingDialog />}

        <h1 className="text-3xl font-bold mb-4 text-white">Remplir la BDD</h1>
        <p className="text-red-600 font-bold mb-4">/!\ ATTENTION /!\</p>

        <p className="mb-4 text-white">
          Remplir la BDD va supprimer toutes les données existantes<br />
          et remplir la base de données avec de nouvelles données.
        </p>
        <p className="mb-4 text-white">
          Soyez sûr que vous pouvez faire cela sans perdre de<br />
          données importantes ou déranger le bon fonctionnement<br />
          du site web/de l’application mobile.
        </p>

        <button 
          onClick={(event) => this.populate(event)} 
          className="bg-custom-primary_color hover:bg-custom-hover_effect text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Remplir
        </button>

        {/* Dialogs */}
        {this.state.showDialog && (
          <div className="mt-4 p-4 bg-custom-primary_color rounded shadow">
            <p>{this.state.dialogMessage}</p>
            <button onClick={this.closeDialog} className="mt-2 bg-custom-primary_color text-white py-1 px-3 rounded">Fermer</button>
          </div>
        )}
      </div>
    );
  }
}

export default PopulateDB;
