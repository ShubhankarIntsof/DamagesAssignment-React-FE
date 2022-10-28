import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

function DamageCreate() {
  const [evidencedata, setEData] = useState([]);
  const [damageleveldata, setDamageData] = useState([]);
  const [evidencearray, setEArray] = useState([]);
  const [damageByValue, setDValue] = useState([]); //stores damage value temporarily
  const [damageBy, setDamageBy] = useState(); //using to set "Evidence of fire damage .."
  const [estimate, setEstimate] = useState();
  const [strDamage, setStrDamage] = useState();
  const [sidingDamage, setSidingDamage] = useState();
  const [roofMissing, setRoofMissing] = useState();

  const URLEvd =
    'https://localhost:44302/api/Damages/GetLkpDamageType';

  const URLDamageLevel =
    'https://localhost:44302/api/Damages/GetDamageEvidence/'; //also a lookup table

  const URLCreate =
    'https://localhost:44302/api/Damages/PostMainData';

  useEffect(() => {
    fetchEvidenceData();
  }, []);

  const fetchDamageLevel = (e, n) => {
    fetch(URLDamageLevel + e.target.value)
      .then((res) => res.json())

      .then((response) => {
        const r = JSON.stringify(response);
        setDamageData(JSON.parse(r));
        var k = JSON.parse(r);
        const value = e.target.value;

        if (k == 0) {
          console.log(k);
          console.log('setting in array');
          setDamageBy();
          const finalvalue = {
            damageType: value,
            damageEvidence: null,
            specifyOthers: null,
            isDeleted: 'false',
          };
          setEArray([...evidencearray, finalvalue]);
        } else {
          console.log(k);
          console.log(n);
          setDValue(value);
          setDamageBy('Evidence of ' + n + ' Damage % *');
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

  const handleCreate = (e) => {
    console.log(' Create Clicked ');
    e.preventDefault();
    try {
      fetch(URLCreate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estimateOfDamages: estimate,
          isStructuralDamage: strDamage,
          isSlidingDamage: sidingDamage,
          isRoofDamage: roofMissing,
          shubhankarAssetInspectionEvidence: evidencearray,
        }),
      }).then((res) => {
        console.log(res.status);
        if (res.status == 200) {
          window.location.reload();
        } else {
          alert('Something went wrong');
        }
      });
    } catch (err) {
      console.log('ERRR' + err);
      alert(err);
    }
  };

  const handleSidingDamage = (e) => {
    console.log(' Siding Damage ' + e.target.value);
    setSidingDamage(e.target.value);
  };
  const handleRoofDamage = (e) => {
    console.log(' Roof Damage ' + e.target.value);
    setRoofMissing(e.target.value);
  };
  const handleEstimateOfDamages = (e) => {
    console.log(' Estimate of Damage ' + e.target.value);
    setEstimate(e.target.value);
  };
  const handleStructuralDamage = (e) => {
    console.log(' Structural Damage ' + e.target.value);
    setStrDamage(e.target.value);
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
      fetchDamageLevel(e, name);
    } else {
      damageleveldata.splice(0, damageleveldata.length);
      setDamageBy();
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
  };

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ marginTop: '40px' }}>New Damage Case</h3>
      {JSON.stringify(evidencearray)}
      {/* {'Damagelevel' + JSON.stringify(damageleveldata)} */}
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
            onChange={handleEstimateOfDamages}
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <div>Structural Damage *</div>
          <input
            type="radio"
            value="Yes"
            name="Structural Damage"
            onChange={handleStructuralDamage}
          />{' '}
          Yes
          <span> </span>
          <input
            type="radio"
            value="No"
            name="Structural Damage"
            onChange={handleStructuralDamage}
          />{' '}
          No
        </div>

        <div style={{ marginTop: '10px' }}>
          <div>Siding Damage or Missing *</div>
          <input
            type="radio"
            value="Yes"
            name="Siding Damage"
            onChange={handleSidingDamage}
          />{' '}
          Yes
          <span> </span>
          <input
            type="radio"
            value="No"
            name="Siding Damage"
            onChange={handleSidingDamage}
          />{' '}
          No
        </div>

        <div style={{ marginTop: '10px' }}>
          <div>Roof Missing *</div>
          <input
            type="radio"
            value="Yes"
            name="Roof Missing"
            onChange={handleRoofDamage}
          />{' '}
          Yes
          <span> </span>
          <input
            type="radio"
            value="No"
            name="Roof Missing"
            onChange={handleRoofDamage}
          />{' '}
          No
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
        <h6>{damageBy}</h6>
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

      <Button
        style={{ marginTop: '15px' }}
        variant="primary"
        type="submit"
        onClick={handleCreate}
      >
        Submit
      </Button>
    </div>
  );
}

export default DamageCreate;
