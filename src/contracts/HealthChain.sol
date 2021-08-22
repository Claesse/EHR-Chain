pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract HealthChain {

	//Variable to address owner of contract.
	address owner;

	//Enum for providers speciality
	enum Speciality {
	 None, Doctor, Chemist, Phlebotomist, Researcher 
	}

	//Neccessary mapping for checking and verifying identity/role
	mapping(address => Patient) public patients;
	mapping(address => Provider) public providers;
	mapping(address => Hospital) public hospitals;
	mapping(address => bool) profileExists;
	mapping(address => bool) hospitalRights;
	mapping(address => bool) admins;

	modifier ownerOnly {
    require(msg.sender == owner, 'Not the owner');
    _;
  	}

  	modifier DocOnly {
  		require(providers[msg.sender].speciality == Speciality.Doctor, 'Not a Doctor');
  	_;	
  	}

  	modifier PhleOnly {
  		require(providers[msg.sender].speciality == Speciality.Phlebotomist, 'Not a Phlebotomist');
  	_;	
  	}

  	modifier ChemistOnly {
  		require(providers[msg.sender].speciality == Speciality.Chemist, 'Not a Chemist');
  	_;	
  	}

  	modifier ResearcherOnly {
  		require(providers[msg.sender].speciality == Speciality.Researcher, 'Not a Researcher');
  	_;	
  	}

  	modifier PatOnly {
  		require(patients[msg.sender].id == msg.sender, 'Not a Patient');
  	_;	
  	}

  	modifier HospOnly {
  		require(hospitals[msg.sender].id == msg.sender, 'Not a Hospital');
  	_;	
  	}

   	function checkIfAdmin(address _address) public view returns (bool) {
		return admins[_address];
	}

  	function checkIfHospital(address _address) public view returns (bool) {
		return hospitalRights[_address];
	}

	function checkIfChemist(address _address) public view returns (bool) {
		if (providers[_address].speciality != Speciality.Chemist) {
			return false;
		} else {
			return true;
		}
	}	

	function checkIfDoctor(address _address) public view returns (bool) {
		if (providers[_address].speciality != Speciality.Doctor) {
			return false;
		} else {
			return true;
		}
	}

	function checkIfPatient(address _address) public view returns (bool) {
		if (patients[_address].id != _address) {
			return false;
		} else {
			return true;
		}
	}

	function checkIfPhlebotomist(address _address) public view returns (bool) {
		if (providers[_address].speciality != Speciality.Phlebotomist) {
			return false;
		} else {
			return true;
		}
	}

	function checkIfResearcher(address _address) public view returns (bool) {
		if (providers[_address].speciality != Speciality.Researcher) {
			return false;
		} else {
			return true;
		}
	}			


	// Make sure deployer is owner.
	constructor() public {
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    // Admin Functions
    function createHospital (address _hospital, string memory _name, string memory _city) public ownerOnly {
    	Hospital memory hosp = Hospital(_hospital, _name, _city);
    	hospitalRights[_hospital] = true;
    	hospitals[_hospital] = hosp;
    }


	// Model a patient
	struct Patient {

		// Identifiers
		address id;
		string name;
		uint birthyear;
		uint month;
		uint day;
		string city;

		string[] labResults;
		string[] prescriptions;
		// Doctor list
		mapping(address => bool) providerAccess;
		//Hash for HR
		string hash;

	}


	// Give doctor access to records.
	function giveAccess(address _doctor) public PatOnly {
		// Make better requirement for granular permissions
		patients[msg.sender].providerAccess[_doctor] = true;
		providers[_doctor].patientAccess[msg.sender] = true;
	}
	// Revoke doctor access to records.
	function revokeAccess(address _doctor) public PatOnly {
		// Make better requirement for granular permissions
		patients[msg.sender].providerAccess[_doctor] = false;
		providers[_doctor].patientAccess[msg.sender] = false;
    }


	struct Provider {

	// Identifiers
	address id;
	string name;
	uint birthyear;
	uint month;
	uint day;
	string city;

	// Create enum for, Chemist, Physician, Researcher, Phlebotomist
	Speciality speciality;

	// Patient List
	mapping(address => bool) patientAccess;
	

	}

	function addLabResults(address _patient, string memory _entry) public PhleOnly {
		require(patients[_patient].providerAccess[msg.sender] == true);
		patients[_patient].labResults.push(_entry);
	}

	function viewLabResults(address _patient) public view returns (string[] memory) {
		require(providers[msg.sender].patientAccess[_patient] == true);
		return patients[_patient].labResults;
	}


	function setHash(address _patient, string memory _hash) public DocOnly {
		require(patients[_patient].providerAccess[msg.sender] == true);
		patients[_patient].hash = "";
		patients[_patient].hash = _hash;
	}

	//Provider getHash
	function getHash(address _patient) public view returns (string memory) {
		require(patients[_patient].providerAccess[msg.sender] == true);
		return patients[_patient].hash;
	}

	//Patient getHash
	function getHashPat(address _patient) public view returns (string memory) {
		require(patients[_patient].id == msg.sender);
		return patients[_patient].hash;
	}


	function addPrescriptions(address _patient, string memory newEntry) public ChemistOnly {
		require(providers[msg.sender].patientAccess[_patient] == true);
		patients[_patient].prescriptions.push(newEntry);

	}

	function removePrescriptions(address _patient, uint remove) public ChemistOnly {
		require(providers[msg.sender].patientAccess[_patient] == true);
		delete patients[_patient].prescriptions[remove];
	}

	function viewPrescriptions(address _patient) public view returns (string[] memory) {
		require(providers[msg.sender].patientAccess[_patient] == true);
		return patients[_patient].prescriptions;
	}



	struct Hospital {

		address id;
		string name;
		string city;

	}


	// Register doctor
	function registerProvider(address _provider, string memory _name, uint _birthyear, uint _month, uint _day, string memory _city, Speciality _speciality) public HospOnly {
		require(hospitalRights[msg.sender] == true);
		Provider memory prov;
		prov.id = _provider;
		prov.name = _name;
		prov.birthyear = _birthyear;
		prov.month = _month;
		prov.day = _day;
		prov.city = _city;
		prov.speciality = _speciality;
		require(!profileExists[_provider]);
		//doctorCount++;
		providers[_provider] = prov;
		profileExists[_provider] = true;
	}

		// Register patient
	function registerPatient(address _patient, string memory _name, uint _birthyear, uint _month, uint _day, string memory _city) public HospOnly {
		require(hospitalRights[msg.sender] == true);
		Patient memory pat;
		pat.id = _patient;
		pat.name = _name;
		pat.birthyear = _birthyear;
		pat.month = _month;
		pat.day = _day;
		pat.city = _city;
		pat.hash = "";
		require(!profileExists[_patient]);
		patients[_patient] = pat;
		profileExists[_patient] = true;

	}

	
}

