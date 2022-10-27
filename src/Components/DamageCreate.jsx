import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

function DamageCreate(props) {
  const [evidencedata, setEData] = useState([]);
  const [evidencearray, setEArray] = useState([]);
  const URLEvd =
    'https://localhost:44302/api/Damages/GetLkpDamageType';

  useEffect(() => {
    fetchEvidenceData();
  }, []);

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

    if (checked) {
      setEArray([...evidencearray, finalvalue]);
    } else {
      setEArray(
        evidencearray.filter(
          (e) => e.damageType !== finalvalue.damageType
        )
      );
    }
    console.log(JSON.stringify(finalvalue));
  };

  return (
    <div>
      <h3 style={{ marginTop: '40px' }}>New Damage Case</h3>
      {JSON.stringify(evidencearray)}
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
    </div>
  );
}

export default DamageCreate;
