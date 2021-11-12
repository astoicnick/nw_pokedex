import logo from './logo.svg';
import './App.css';
import { useState } from "react";

function App() {
  let baseURL = "https://pokeapi.co/api/v2/";
  // const [pokemon, setPokemon] = useState(null);
  const [pokemonArr, setPokemonArr] = useState(null);
  const [speciesArr, setSpeciesArr] = useState(null);
  const [evArr, setEvArr] = useState(null);
  // const [species, setSpecies] = useState(null);
  // const [firstEv, setFirstEv] = useState(null);
  // const [firstEvPokemon, setFirstEvPokemon] = useState(null);
  // const [firstEvSpecies, setFirstEvSpecies] = useState(null);
  // const [secondEv, setSecondEv] = useState(null);
  // const [secondEvPokemon, setSecondEvPokemon] = useState(null);
  // const [secondEvSpecies, setSecondEvSpecies] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  // let totalStats = 0;
  // let firstEvStats = 0;
  // let secondEvStats = 0;
  async function handleClick(e) {
    setLoading(true);
    console.log("Hey!");
    await getPokemonAndEvolution();
    setLoading(false);
  }

  if (loading) {
    return <h1>Loading...</h1>
  }

  async function getPokemonAndEvolution() {
    let pokemonArr = [];
    let speciesArr = [];
    let evArr = [];
    const res = await fetch(`${baseURL}pokemon/${name}`)
    if (res.ok) {
      let pokemon = await res.json()
      // setPokemon(pokemon)
      pokemonArr.push(pokemon)
      let species = await fetch(pokemon.species.url)
      species = await species.json()
      speciesArr.push(species)
      // setSpecies(species)
      let evChain = await fetch(species.evolution_chain.url)
      evChain = await evChain.json()
      if (evChain.chain.evolves_to?.length > 0) {
        // setFirstEv()
        evArr.push(evChain.chain.evolves_to[0])
        let firstEvPokemon = await fetch(`${baseURL}pokemon/${evChain.chain.evolves_to[0].species.name}`)
        let firstEvSpecies = await fetch(evChain.chain.evolves_to[0].species.url)
        firstEvSpecies = await firstEvSpecies.json()
        firstEvPokemon = await firstEvPokemon.json()
        pokemonArr.push(firstEvPokemon)
        speciesArr.push(firstEvSpecies)
        // setFirstEvPokemon(firstEvPokemon)
        // setFirstEvSpecies(firstEvSpecies)
        if (evChain.chain.evolves_to[0].evolves_to?.length > 0) {
          // setSecondEv()
          evArr.push(evChain.chain.evolves_to[0].evolves_to[0])
          let secondEvPokemon = await fetch(`${baseURL}pokemon/${evChain.chain.evolves_to[0].evolves_to[0].species.name}`)
          let secondEvSpecies = await fetch(evChain.chain.evolves_to[0].evolves_to[0].species.url)
          secondEvSpecies = await secondEvSpecies.json()
          secondEvPokemon = await secondEvPokemon.json()
          pokemonArr.push(secondEvPokemon)
          speciesArr.push(secondEvSpecies)
          // setSecondEvPokemon(secondEvPokemon)
          // setSecondEvSpecies(secondEvSpecies)
          console.log(secondEvSpecies)
        }
      }
    }
    setPokemonArr(pokemonArr)
    setSpeciesArr(speciesArr)
    setEvArr(evArr)
    console.log(pokemonArr)
    setLoading(false);
  }

  return (
    <div>
      <div className="container" style={{ marginTop: 10 }}>
        <div className="row" style={{ margin: "0 auto" }}>
          <div className='col-10'>
            <input className="form-control" onChange={(e) => setName(e.target.value)} placeholder="mudkip" />
          </div>
          <div className="col-2">
            <button onClick={handleClick} className="btn btn-success form-control">Search</button>
          </div>
        </div>
        {pokemonArr ?
          <div className="row" style={{ marginTop: 10 }}>
            {pokemonArr.map((pokemon, index) => {
              let totalStats = 0;
              let hasEv = index > 0;
              let evString;
              let evDetails;
              let flavorText;
              if(hasEv) {
                evDetails = evArr[index - 1].evolution_details[0];
                if(evDetails.min_happiness) {
                  evString = `Evolves with ${evDetails.min_happiness} Happiness`
                }
                else if(evDetails.min_level)
                {
                  evString = `Evolves at Level ${evDetails.min_level}`
                }
                else if(evDetails.item) {
                  evString = `Evolves with ${evDetails.item.name}`
                }
              }
              const species = speciesArr[index];
              const flavorTexts = species.flavor_text_entries;
              for (let i = 0; i < species.flavor_text_entries.length ; i++) {
                if(flavorTexts[i].language.name == "en") {
                  flavorText = flavorTexts[i].flavor_text
                  break;
                }
              }
              return (
              <div className="col-4">
                <div className="card">
                  <div className="card-header">
                    {hasEv ? 
                    evString
                    : pokemon.name}
                  </div>
                  <img src={pokemon.sprites.front_default} className="card-img-top" alt={pokemon.name} style={{ height: "225px", width: "225px" }} />
                  <div className="card-body">
                    <p className="card-text">
                      {flavorText}
                    </p>
                  </div>
                  <div className="accordion" id="accordionExample">
                  <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="true" aria-controls="collapseOne">
                          Types
                        </button>
                      </h2>
                      <div id={`collapse${index}`} className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                          <ul className="list-group list-group-flush">
                            {pokemon.types.map(type => {
                              return (
                                <li className="list-group-item text-center">
                                  {type.type.name}
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                          Stats
                        </button>
                      </h2>
                      <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                          <ul className="list-group list-group-flush">
                            {pokemon.stats.map(stat => {
                              totalStats += stat.base_stat
                              return (
                                <li className="list-group-item" style={{ justifyItems: "stretch" }}>
                                  <strong>{stat.stat.name}:</strong>   <span>{stat.base_stat}</span>
                                </li>
                              )
                            })}
                            <div className="card-footer">
                              <strong>Total: </strong> {totalStats}
                            </div>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>
          // <div className="row" style={{ marginTop: 10 }}>
          //   <div className="col-4">
          //     <div className="card">
          //       <img src={pokemon.sprites.front_default} className="card-img-top" alt={pokemon.name} style={{ height: "225px", width: "225px" }} />
          //       <div className="card-body">
          //         <p className="card-text">
          //           {species.flavor_text_entries[0].flavor_text}
          //         </p>
          //       </div>
          //       <div className="accordion" id="accordionExample">
          //         <div className="accordion-item">
          //           <h2 className="accordion-header" id="headingOne">
          //             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          //               Stats
          //             </button>
          //           </h2>
          //           <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          //             <div className="accordion-body">
          //               <ul className="list-group list-group-flush">
          //                 {pokemon.stats.map(stat => {
          //                   totalStats += stat.base_stat
          //                   return (
          //                     <li className="list-group-item" style={{ justifyItems: "stretch" }}>
          //                       <strong>{stat.stat.name}:</strong>   <span>{stat.base_stat}</span>
          //                     </li>
          //                   )
          //                 })}
          //                 <div className="card-footer">
          //                   <strong>Total: </strong> {totalStats}
          //                 </div>
          //               </ul>
          //             </div>
          //           </div>
          //         </div>
          //       </div>

          //     </div>
          //   </div>
          //   {firstEvPokemon ?
          //     <div className="col-4">
          //       <div className="card">
          //         <img src={firstEvPokemon.sprites.front_default} className="card-img-top" alt={pokemon.name} style={{ height: "225px", width: "225px" }} />
          //         <div className="card-body">
          //           <p className="card-text">
          //             {firstEvSpecies.flavor_text_entries[0].flavor_text}
          //           </p>
          //         </div>
          //         <div className="accordion" id="accordionExample">
          //           <div className="accordion-item">
          //             <h2 className="accordion-header" id="headingOne">
          //               <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          //                 Stats
          //               </button>
          //             </h2>
          //             <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          //               <div className="accordion-body">
          //                 <ul className="list-group list-group-flush">
          //                   {firstEvPokemon.stats.map(stat => {
          //                     firstEvStats += stat.base_stat
          //                     return (
          //                       <li className="list-group-item" style={{ justifyItems: "stretch" }}>
          //                         <strong>{stat.stat.name}:</strong>   <span>{stat.base_stat}</span>
          //                       </li>
          //                     )
          //                   })}
          //                   <div className="card-footer">
          //                     <strong>Total: </strong> {firstEvStats}
          //                   </div>
          //                 </ul>
          //               </div>
          //             </div>
          //           </div>
          //         </div>

          //       </div>
          //     </div>
          //     : null}
          //   {secondEvPokemon ? 
          //   <div className="col-4">
          //   <div className="card">
          //     <img src={secondEvPokemon.sprites.front_default} className="card-img-top" alt={secondEvPokemon.name} style={{ height: "225px", width: "225px" }} />
          //     <div className="card-body">
          //       <p className="card-text">
          //         {secondEvSpecies.flavor_text_entries[0].flavor_text}
          //       </p>
          //     </div>
          //     <div className="accordion" id="accordionExample">
          //       <div className="accordion-item">
          //         <h2 className="accordion-header" id="headingOne">
          //           <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          //             Stats
          //           </button>
          //         </h2>
          //         <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          //           <div className="accordion-body">
          //           <ul className="list-group list-group-flush">
          //       {secondEvPokemon.stats.map(stat => {
          //         secondEvStats += stat.base_stat
          //         return (
          //           <li className="list-group-item" style={{ justifyItems: "stretch" }}>
          //             <strong>{stat.stat.name}:</strong>   <span>{stat.base_stat}</span>
          //           </li>
          //         )
          //       })}
          //       <div className="card-footer">
          //         <strong>Total: </strong> {secondEvStats}
          //       </div>
          //     </ul>
          //           </div>
          //         </div>
          //       </div>
          //     </div>

          //   </div>
          // </div> 
          // : null}
          // </div>
          : null}
      </div>
    </div>
  );


}

export default App;
