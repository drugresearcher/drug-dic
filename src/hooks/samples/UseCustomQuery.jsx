import React from 'react';

import { useCustomQuery } from '../customFetch';
import { setLanguage, setAPIEndpoint } from '../../services/api/endpoints';

const UseCustomQuerySample = (id) => {
	const apiBaseEndpoint = 'http://localhost:3000/api';
	const lang = 'en';
	setLanguage(lang);
	setAPIEndpoint(`${apiBaseEndpoint}/sampleapi/v1/sampleendpoint`);
	const { loading, payload } = useCustomQuery(getSampleCallResults(id));
	return <>{!loading && payload && <h1>{payload.contentMessage}</h1>}</>;
};

const getSampleCallResults = ({ id }) => {
	return {
		method: 'GET',
		endpoint: `/sampleendpoint/${id}`,
	};
};

export default UseCustomQuerySample;
