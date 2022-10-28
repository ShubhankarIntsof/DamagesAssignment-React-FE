import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

function DamageCreate() {
  const [evidencedata, setEData] = useState([]);
  const [damageleveldata, setDamageData] = useState([]);
  const [evidencearray, setEArray] = useState([]);
  const [damageEvidenceId, setDId] = useState([]);
  const [damageByValue, setDValue] = useState([]);
  var transferForLevel;

  const URLEvd =
    'https://localhost:44302/api/Damages/GetLkpDamageType';

  const URLDamageLevel =
    'https://localhost:44302/api/Damages/GetDamageEvidence/';

  useEffect(() => {
    fetchEvidenceData();
  }, []);

  const fetchDamageLevel = (e) => {
    fetch(URLDamageLevel + e.target.value)
      .then((res) => res.json())

      .then((response) => {
        const r = JSON.stringify(response);
        setDamageData(JSON.parse(r));
        //var k = Object.keys(damageleveldata).length; //Object.keys(damageleveldata).length
        var k = JSON.parse(r);
        const value = e.target.value;
        //const name = e.target.name;
        //const checked = e.target.checked;

        if (k == 0) {
          console.log(k);
          console.log('setting in array');
          const finalvalue = {
            damageType: value,
            damageEvidence: null,
            specifyOthers: null,
            isDeleted: 'false',
          };
          setEArray([...evidencearray, finalvalue]);
        } else {
          console.log(k);
          console.log('choose the level');
          setDValue(value);
          //transferForLevel = finalvalue;
        }
        console.log('Response DAMAGE LEVEL ' + r);
      });
  };

  const fetchEvidenceData = () => {
    fetch(URLEvd)
      .then((res) => res.json())

      .then((response) => {
        const r = JSON.stringify(response);
        setEData(JSON.parse(r));
        //console.log('Response ' + r);
      });
  };

  const handleCheck = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    const checked = e.target.checked;
    const finalvalue = {
      damageType: value,
      damageEvidence: null,
      specifyOthers: null,
      isDeleted: 'false',
    };
    console.log(value, checked, name);

    if (checked == true) {
      //fetchDamageLevel(value);
      fetchDamageLevel(e);
    } else {
      damageleveldata.splice(0, damageleveldata.length);
      setEArray(
        evidencearray.filter(
          (e) => e.damageType !== finalvalue.damageType
        )
      );
    }
  };

  const handleDamageLevel = (e) => {
    console.log(e.target.value);
    //setDId(e.target.value);
    var data = e.target.value;
    const finalvalue = {
      damageType: damageByValue,
      damageEvidence: data,
      specifyOthers: null,
      isDeleted: 'false',
    };
    setEArray([...evidencearray, finalvalue]);
    //transferForLevel.damageEvidence = e.target.value;
  };

  return (
    <div>
      <h3 style={{ marginTop: '40px' }}>New Damage Case</h3>
      {JSON.stringify(evidencearray)}
      {'Damagelevel' + JSON.stringify(damageleveldata)}
      <form
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: '35px',
          //justifyContent: 'space-around',
          gap: '35px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <label>Estimate of Damges * &nbsp;</label>
          <input
            className="form-control"
            style={{ width: '250px', height: '30px' }}
            type="number"
            placeholder="Enter Estimate of Damages"
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <div>Structural Damage *</div>
          <input
            type="radio"
            value="Yes"
            name="Structural Damage"
          />{' '}
          Yes
          <span> </span>
          <input
            type="radio"
            value="No"
            name="Structural Damage"
          />{' '}
          No
        </div>

        <div style={{ marginTop: '10px' }}>
          <div>Siding Damage or Missing *</div>
          <input type="radio" value="Yes" name="Siding Damage" /> Yes
          <span> </span>
          <input type="radio" value="No" name="Siding Damage" /> No
        </div>

        <div style={{ marginTop: '10px' }}>
          <div>Roof Missing *</div>
          <input type="radio" value="Yes" name="Roof Missing" /> Yes
          <span> </span>
          <input type="radio" value="No" name="Roof Missing" /> No
        </div>
        <hr />
      </form>
      <hr />
      <div>
        <h6>Property Shows Damage By *</h6>
        <div>{'  '} </div>
        {evidencedata.map((item, i) => (
          <div>
            {item.damageValue} &nbsp;
            <input
              type="checkbox"
              value={item.damageTypeId}
              name={item.damageValue}
              id={item.id}
              onChange={handleCheck}
            />
          </div>
        ))}
      </div>
      <hr />
      <div>
        <h6>Evidence *</h6>
        <form>
          {damageleveldata.map((item, i) => (
            <div>
              {item.damageLevel + ' '}
              <input
                type="radio"
                value={item.damageEvidenceId}
                name="Evidence Level"
                onChange={handleDamageLevel}
              />
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}

export default DamageCreate;
