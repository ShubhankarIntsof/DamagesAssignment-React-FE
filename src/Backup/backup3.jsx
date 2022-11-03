import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

function DamageCreate() {
  const [evidencedata, setEData] = useState([]); // stores checkbox options from api
  const [damageleveldata, setDamageData] = useState([]); // stores values of radio buttons for each checkbox
  const [evidencearray, setEArray] = useState([]); //stores user selected checkboxes having no additional radio button
  const [damageByValue, setDValue] = useState([]); //stores the values of checkboxes having child like fire has radio btn
  const [damageBy, setDamageBy] = useState(); //using to set "Evidence of fire/flood damage .."
  const [estimate, setEstimate] = useState(); // stores value for estimate text box
  const [strDamage, setStrDamage] = useState();
  const [sidingDamage, setSidingDamage] = useState();
  const [roofMissing, setRoofMissing] = useState();
  const [othersFlag, setOthersFlag] = useState(false); //using for checking if others checkbox is clicked
  const [others, setOthers] = useState(null); //stores value of others textbox
  const [templeveldata, settempleveldata] = useState(null); //stores single radio button selection  --d
  const [templeveldata2, settempleveldata2] = useState({}); //stores multiple radio selection without duplicates
  //Flags
  const [estimateFlag, setEstimateFlag] = useState(false);
  const [strucDmgFlag, setstrDmgFlag] = useState(false);
  const [sidingDmgFlag, setsidingDmgFlag] = useState(false);
  const [roofDmgFlag, setroofDmgFlag] = useState(false);
  const [damagebyFlag, setdamagebyFlag] = useState(false); // flag for checkbox validation step 1
  const [othersTxtFlag, setothersTxtFlag] = useState(false); //using to check if others textbox is filled or not
  const [levelFlag, setlevelFlag] = useState(false); //sets true when the checkbox having child gets clicked
  const [NoneFlag, setNoneFlag] = useState(false);
  const [disableFlag, setDisableFlag] = useState(false);
  const [levelFillFlag, setlevelFillFlag] = useState(false); //sets true when user clicks radio child button
  const [radioFlag, setradioFlag] = useState(false);

  const URLEvd =
    'https://localhost:44302/api/Damages/GetLkpDamageType';

  const URLDamageLevel =
    'https://localhost:44302/api/Damages/GetDamageEvidence/'; // a lookup table

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
          // checks if the options is empty for a damage reason
          console.log(k);
          console.log('setting in array');
          setlevelFlag(false);
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
          setlevelFlag(true);
          setlevelFillFlag(false);
          setDamageBy('Evidence of ' + n + ' Damage % *');
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
  const validator = () => {
    if ((estimate == null || estimate == '') && NoneFlag == false) {
      setEstimateFlag(true);
      return false;
    } else if (strDamage == null) {
      setstrDmgFlag(true);
      return false;
    } else if (sidingDamage == null) {
      setsidingDmgFlag(true);
      return false;
    } else if (roofMissing == null) {
      setroofDmgFlag(true);
      return false;
    } else if (
      evidencearray.length == 0 &&
      others == false
      //|| (Object.keys(templeveldata2).length == 0 && others == false)
    ) {
      setdamagebyFlag(true);
      return false;
    } else if (levelFlag && !levelFillFlag) {
      //setlevelFillFlag(true);
      setradioFlag(true);
      return false;
    } else if (othersFlag == true && others == null) {
      setothersTxtFlag(true);
      return false;
    } else if (evidencearray.length > 0) {
      return true;
    } else {
      return true;
    }
  };

  const handleCreate = (e) => {
    console.log(' Create Clicked ');

    var k = evidencearray;
    if (validator()) {
      e.preventDefault();

      try {
        if (others != null) {
          console.log(' inside others != null ');
          const finalvalue = {
            damageType: 9, //hardcoded for others as special case
            damageEvidence: null,
            specifyOthers: others,
            isDeleted: 'false',
          };
          k.push(finalvalue);
          //setEArray([...evidencearray, finalvalue], () => {});
        }
        if (
          Object.keys(templeveldata2).length > 0 ||
          levelFlag == true
        ) {
          //k.push(templeveldata);------------
          console.log('TEMP TABLE');
          Object.values(templeveldata2).forEach((val) => k.push(val));
        }
        fetch(URLCreate, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            estimateOfDamages: estimate,
            isStructuralDamage: strDamage,
            isSlidingDamage: sidingDamage,
            isRoofDamage: roofMissing,
            shubhankarAssetInspectionEvidence: k,
          }),
        }).then((res) => {
          console.log(res.status);
          if (res.status == 200) {
            window.location.reload();
            alert('Case Created'); //for development purpose
          } else {
            console.log(JSON.stringify(res));
            alert('Something went wrong');
          }
        });
      } catch (err) {
        console.log('ERRR' + err);
        alert(err);
      }
    }
  };

  const handleReset = (e) => {
    window.location.reload();
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
  const handleDamageByCheck = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    const checked = e.target.checked;

    console.log(value, checked, name);

    if (checked == true) {
      setlevelFlag(true);
      if (name == 'Other') {
        //hardcoding for others section
        setlevelFlag(false);
        setOthersFlag(true);
      } else if (name == 'None') {
        setNoneFlag(true);
        setDisableFlag(true);
        fetchDamageLevel(e, name);
      } else {
        setOthersFlag(false);
        fetchDamageLevel(e, name);
      }
    } else {
      // when the checkbox get unchecked
      setlevelFlag(false);
      if (name == 'None') {
        setNoneFlag(false);
        setDisableFlag(false);
      }
      if (
        Object.keys(templeveldata2).length != 0 ||
        (levelFillFlag && levelFlag)
      ) {
        console.log('Level to be deleted' + e.target.value);
        var k = e.target.value;
        settempleveldata2((current) => {
          const copy = { ...current };
          delete copy[k];
          return copy;
        });
        settempleveldata(null);
        setlevelFillFlag(false);
      }
      setOthersFlag(false);
      setOthers(null);
      damageleveldata.splice(0, damageleveldata.length); //deleting the array when check is removed
      setDamageBy();
      setEArray(evidencearray.filter((e) => e.damageType !== value));
    }
  };
  const handleOthers = (e) => {
    setOthers(e.target.value);
  };

  const handleDamageLevel = (e, i) => {
    console.log(e);
    console.log('HIT ' + i.damageLevel);
    //setDId(e.target.value);
    var data = e;
    const finalvalue = {
      damageType: damageByValue,
      damageEvidence: data,
      specifyOthers: null,
      isDeleted: 'false',
    };
    setlevelFlag(false);
    setlevelFillFlag(true);
    settempleveldata(finalvalue);
    settempleveldata2((prevState) => ({
      ...prevState,
      [damageByValue]: finalvalue,
    }));

    //setEArray([...evidencearray, finalvalue]);
  };

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ marginTop: '40px' }}>New Damage Case</h3>

      {/* <div>{JSON.stringify(evidencearray)}</div> */}
      {/* <div>{JSON.stringify(templeveldata)}</div> */}
      <div>{JSON.stringify(templeveldata2)}</div>
      <div>level Flag: {String(levelFlag)}</div>
      <div>level fill Flag: {String(levelFillFlag)}</div>

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
          {estimateFlag && (
            <label style={{ color: 'red' }}>
              Please provide Estimate of Damages
            </label>
          )}

          <input
            className="form-control"
            style={{ width: '250px', height: '30px' }}
            type="number"
            placeholder="Enter Estimate of Damages"
            onChange={handleEstimateOfDamages}
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <div>
            Structural Damage *{' '}
            {strucDmgFlag && (
              <label style={{ color: 'red' }}>
                Please select either Yes or No
              </label>
            )}
          </div>
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
          <div>
            Siding Damage or Missing *{' '}
            {sidingDmgFlag && (
              <label style={{ color: 'red' }}>
                Please select either Yes or No
              </label>
            )}
          </div>
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
          <div>
            Roof Missing *{' '}
            {roofDmgFlag && (
              <label style={{ color: 'red' }}>
                Please select either Yes or No
              </label>
            )}
          </div>
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <h6>Property Shows Damage By * </h6>
        {damagebyFlag && (
          <label style={{ color: 'red' }}>
            &nbsp;Please select property shows damage type.&nbsp;
          </label>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <div>{'  '} </div>
        {evidencedata.map((item, i) => (
          <div>
            {item.damageValue} &nbsp;
            <input
              style={{
                marginRight: '35px',
              }}
              type="checkbox"
              disabled={item.damageValue != 'None' && disableFlag}
              value={item.damageTypeId}
              name={item.damageValue}
              id={item.id}
              onChange={handleDamageByCheck}
            />
            &nbsp;
          </div>
        ))}
      </div>
      <hr />
      {othersFlag == true && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <label>Specify Others * &nbsp;</label>
          {othersTxtFlag && (
            <label style={{ color: 'red' }}>
              Please specify Other.
            </label>
          )}
          <input
            className="form-control"
            style={{ width: '250px', height: '30px' }}
            type="text"
            placeholder="Enter Estimate of Damages"
            onChange={handleOthers}
          />
        </div>
      )}
      <div>
        <h6>{damageBy}</h6>
        {radioFlag && (
          <label style={{ color: 'red' }}>
            Please select percent Evidence of Flood/Water Damage.
          </label>
        )}
        <form>
          {damageleveldata.map((item, i) => (
            <div>
              {item.damageLevel + ' '}
              <input
                type="radio"
                value={item.damageEvidenceId}
                name={damageBy}
                onChange={() =>
                  handleDamageLevel(item.damageEvidenceId, item)
                }
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
      <Button
        style={{ marginTop: '15px', marginLeft: '20px' }}
        variant="warning"
        type="submit"
        onClick={handleReset}
      >
        Reset
      </Button>
    </div>
  );
}

export default DamageCreate;
