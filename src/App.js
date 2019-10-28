import React, {useState} from 'react';
import axios from 'axios';
import { ResponsiveRadar } from '@nivo/radar'
import AsyncSelect from 'react-select/async';

function App() {
  const [ superHeroList, setSuperHeroList ] = useState([
    {
      "stat": "Intelligence",
    },
    {
      "stat": "Strength",
    },
    {
      "stat": "Speed",
    },
    {
      "stat": "Durability",
    },
    {
      "stat": "Power",
    },
    {
      "stat": "Combat",
    }
  ]);
  let typingTimer;              //timer identifier
  const typingInterval = 1000;  //time in ms, 5 second for example


  const getKeys = () => {
    const keys = Object.keys(superHeroList[0]);
    const superheros = keys.slice(1);
    return superheros;
  }

  const handleInputChange = newValue => {
    if (newValue){
      if (newValue.length > 1) {
        newValue.forEach(item => {
          updateStateWithStats(item);
        })
      } else {
        updateStateWithStats(newValue[0]);
      }
    }
  };

  const updateStateWithStats = character => {
    const powerstats = character.powerstats;
    for (let [key, value] of Object.entries(powerstats)) {
      for (var i = 0; i < superHeroList.length; i++) {
        const newState = [...superHeroList]
        if (newState[i]["stat"].toLowerCase() === key.toLowerCase()) {
          newState[i][character.label]=value;
        }
        setSuperHeroList(newState);
      }
    }
  }

  const promiseOptions = inputValue =>
  new Promise(resolve => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      resolve(delaySearch(inputValue));
    }, typingInterval);
  });


  const delaySearch = value => {
    return axios.get(`https://superheroapi.com/api.php/${process.env.REACT_APP_SUPERHERO_API}/search/${value}`)
    .then(res => {
      let options = [];
      res.data.results.forEach(item => {
        options.push({
          value: item.id,
          label: item.name,
          powerstats: item.powerstats,
        });
      });
      return options;
    })
    .catch(err => {
      console.log(err);
    })
  }


  return (
    <div>
      <h4>Select your superhero</h4>
      <AsyncSelect
        isMulti
        cacheOptions
        loadOptions={promiseOptions}
        onChange={(e) => handleInputChange(e)}
      />
      <div style={{height: '400px'}}>
        <ResponsiveRadar
          data={superHeroList}
          keys={getKeys()}
          indexBy="stat"
          maxValue={100}
          margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
          curve="linearClosed"
          borderWidth={2}
          borderColor={{ from: 'color' }}
          gridLevels={5}
          gridShape="circular"
          gridLabelOffset={36}
          enableDots={true}
          dotSize={10}
          dotColor={{ theme: 'background' }}
          dotBorderWidth={2}
          dotBorderColor={{ from: 'color' }}
          enableDotLabel={true}
          dotLabel="value"
          dotLabelYOffset={-12}
          colors={{ scheme: 'nivo' }}
          fillOpacity={0.1}
          blendMode="multiply"
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          isInteractive={true}
          legends={[
              {
                  anchor: 'top-left',
                  direction: 'column',
                  translateX: -50,
                  translateY: -40,
                  itemWidth: 80,
                  itemHeight: 20,
                  itemTextColor: '#999',
                  symbolSize: 12,
                  symbolShape: 'circle',
                  effects: [
                      {
                          on: 'hover',
                          style: {
                              itemTextColor: '#000'
                          }
                      }
                  ]
              }
          ]}
        />
      </div>
    </div>
  );
}

export default App;
