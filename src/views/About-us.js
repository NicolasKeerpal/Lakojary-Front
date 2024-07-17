import React from 'react';

const AboutUs = () => {
  return (
    <div className='bg-custom-primary_color'>
      {/* Section d'Arrière-Plan */}
      <div className="flex items-center justify-center bg-cover bg-center bg-no-repeat h-[30rem]" style={{ backgroundImage: `url('/assets/bk-image.png')` }}>
        <div className="text-center">
          <p className="text-white text-8xl font-bold mb-10">À Propos de Lakojary</p>
          <p className="text-white text-2xl mb-10">
            Nous livrons vos pâtisseries préférées <strong>directement chez vous</strong>
          </p>
        </div>
      </div>

      {/* Section Savoir Faire */}
      <div className="flex justify-center mt-[2rem]">
        <div className="text-center">
          <p className="text-white text-[3rem] font-bold">Savoir Faire</p>
          <p className="text-white text-[1.2rem]">Préparations maison depuis 20 ans !</p>
          <p className="text-white text-[1.2rem]">Nous préparons chacun de nos produits de manière artisanale.</p>

          <div className="flex justify-center mt-4">
            <img src="/assets/preparing1.png" alt="Image 1" className="w-[20rem] h-auto mx-2" />
            <img src="/assets/preparing2.png" alt="Image 2" className="w-[20rem] h-auto mx-2" />
            <img src="/assets/preparing3.png" alt="Image 3" className="w-[20rem] h-auto mx-2" />
          </div>
        </div>
      </div>

      {/* Section Notre Histoire */}
      <div className="flex justify-center mt-[5rem] mb-[5rem]">
        <div>
          <p className="text-center text-white text-[3rem] font-bold">Notre Histoire</p>

          <div className="flex items-center justify-between px-[20rem] mt-[2rem]">
            <img src="/assets/image 5.png" alt="Image 1" className="w-[20rem] h-auto mx-2" />
            <div className="ml-4">
              <p className="text-white text-[1.2rem]">
                Nous avons remarqué que certaines personnes n'ont pas accès à des boulangeries près de chez elles, et ne peuvent donc pas profiter de ce que les boulangeries ont à offrir.<br />
                De plus, certaines personnes d'origines étrangères ne trouvent pas les pâtisseries de leurs pays d'origine en France, et ne peuvent donc pas goûter aux aliments qui leur manquent.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between px-[20rem] mt-[4rem]">
            <p className="text-white text-[1.2rem]">
              C'est pourquoi nous avons créé une boulangerie en ligne nommée Lakojary. Lakojary est une boulangerie 100% en ligne qui propose des pâtisseries de toutes les cultures à travers sa boutique en ligne.<br />
              Ainsi, les personnes qui n'ont pas accès aux boulangeries, celles qui souhaitent découvrir des spécialités d'autres cultures, ou celles qui veulent redécouvrir les saveurs de leur propre culture peuvent le faire avec Lakojary !
            </p>
            <div className="ml-4">
              <img src="../assets/image 6.png" alt="Image 1" className="w-[50rem] h-auto mx-2" />
            </div>
          </div>  
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
