import logo from './logo.svg';
import './App.css';
import { useState } from "react";

function App() {
  let baseURL = "https://pokeapi.co/api/v2/";
  const [name, setName] = useState('');
  let pokemon, firstEv, secondEv;
  const [loading, setLoading] = useState(false);

  async function handleClick(e) {
    e.preventDefault();
    await getPokemonAndEvolution();
  }

  if(loading){
    return <h1>Loading...</h1>
  }

  return (
    <div>
      <div className="container" style={{marginTop: 10}}>
        <div className="row justify-center">
          <div className='col-9'>
            <input className="form-control" onChange={(e) => setName(e.target.value)} placeholder="mudkip" />
          </div>
          <div className="col-auto">
            <button onClick={async () => handleClick} className="btn btn-primary form-control">Search</button>
          </div>
        </div>
        {pokemon ?
          <div className="row">
            <h1>Results</h1>
          </div> : null}
      </div>
    </div>
  );

  async function getPokemonAndEvolution() {
    const res = await fetch(`pokemon/${name}`)
    if(res.ok) {
      pokemon = await res.json()
      
    }
  }
}

export default App;
