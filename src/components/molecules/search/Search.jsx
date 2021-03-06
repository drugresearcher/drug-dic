import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTracking } from 'react-tracking';

import './Search.scss';

import { Autocomplete, Radio } from '../../atomic';
import {
	searchMatchType,
	searchMatchTypeAnalyticsMap,
} from '../../../constants';
import { useAppPaths, useAutoSuggestResultsQuery } from '../../../hooks';
import { useStateValue } from '../../../store/store';
import {
	emboldenSubstring,
	getKeyValueFromObject,
	getKeyValueFromQueryString,
} from '../../../utils';

const Search = ({ autoSuggestLimit = 10 }) => {
	const params = useParams();
	const location = useLocation();
	const { searchText: urlParamSearchText } = params;
	const { search } = location;
	const tracking = useTracking();
	const [{ analyticsName, dictionaryTitle }] = useStateValue();

	// Set matchType to value retrieved from url if it exits and default to "Begins" if not
	const matchType =
		search && getKeyValueFromQueryString('searchMode', search) !== null
			? getKeyValueFromQueryString('searchMode', search)
			: searchMatchType.beginsWith;
	// Set default selected option for search match type
	const [errorMessage, setErrorMessage] = useState(null);
	const [selectedOption, setSelectedOption] = useState(matchType);
	// Set default search text to value retrieved from url or set to empty string if not
	const [searchText, setSearchText] = useState(
		urlParamSearchText ? urlParamSearchText : ''
	);
	const [shouldFetchAutoSuggest, setFetchAutoSuggest] = useState(false);
	const navigate = useNavigate();
	const { SearchPath } = useAppPaths();
	const autoSuggest = useAutoSuggestResultsQuery({
		query: searchText,
		resultLimit: autoSuggestLimit,
		selectedOption,
		shouldFetch: shouldFetchAutoSuggest,
	});

	useEffect( () => {
		if (searchText.length > 30) {
			setErrorMessage('Please enter up to 30 characters for suggested search options');
		}
	}, []);

	useEffect(() => {
		// Set selected option value if url parameters change
		setSelectedOption(matchType);
	}, [matchType]);

	const trackSubmit = () => {
		const searchType =
			selectedOption &&
			getKeyValueFromObject(selectedOption, searchMatchTypeAnalyticsMap)
				? getKeyValueFromObject(selectedOption, searchMatchTypeAnalyticsMap)
				: searchMatchTypeAnalyticsMap[searchMatchType.beginsWith];
		tracking.trackEvent({
			type: 'Other',
			event: 'DrugDictionaryApp:Other:KeywordSearch',
			linkName: 'DrugDictionarySearch',
			searchTerm: searchText,
			searchType: searchType,
			analyticsName,
			dictionaryTitle,
		});
	};

	const executeSearch = (e) => {
		e.preventDefault();
		const isContainsSearch =
			selectedOption && selectedOption === searchMatchType.contains;
		const hasSearchText = searchText.length > 0;
		const queryString = hasSearchText
			? isContainsSearch
				? `${encodeURIComponent(searchText)}/?searchMode=${
						searchMatchType.contains
				  }`
				: `${encodeURIComponent(searchText)}/?searchMode=${
						searchMatchType.beginsWith
				  }`
			: `/`;
		trackSubmit();
		navigate(SearchPath({ searchText: queryString }));
	};

	const toggleRadioSelection = (event) => {
		const { value } = event.target;
		setSelectedOption(value);
	};

	const onChangeHandler = (event) => {
		const { value } = event.target;
		setSearchText(value);
		// Make auto suggest API call if search text length >= 3
		if (value.length >= 3 && value.length <= 30) {
			setErrorMessage(null);
			setFetchAutoSuggest(true);
			return;
		}
		if (value.length > 30) {
			setErrorMessage('Please enter up to 30 characters for suggested search options');
			return;
		}
		setErrorMessage(null)
		setFetchAutoSuggest(false);
	};

	const onSelectHandler = (value) => {
		setSearchText(value);
	};

	return (
		<form
			className="drug-search"
			data-testid="tid-search-container"
			onSubmit={executeSearch}>
			<div className="radio-selection">
				<Radio
					label="Starts with"
					id="starts-with"
					className="inline"
					value={searchMatchType.beginsWith}
					defaultChecked={selectedOption === searchMatchType.beginsWith}
					onChange={toggleRadioSelection}
				/>
				<Radio
					label="Contains"
					id="contains"
					className="inline"
					value={searchMatchType.contains}
					defaultChecked={selectedOption === searchMatchType.contains}
					onChange={toggleRadioSelection}
				/>
			</div>
			<div className="drug-search__error-message">{errorMessage}</div>
			<Autocomplete
				id="keywords"
				label="Enter keywords or phrases"
				labelHidden
				wrapperClasses="drug-search__input"
				inputClasses="drug-search__input"
				value={searchText}
				inputProps={{
					placeholder: 'Enter keywords or phrases',
				}}
				items={(!autoSuggest.loading && autoSuggest.payload) || []}
				getItemValue={(item) => item.termName}
				onChange={(event) => onChangeHandler(event)}
				onSelect={(value, item) => onSelectHandler(value)}
				renderMenu={(children, index) => (
					<div
						key={index}
						className="ncids-autocomplete__menu --terms"
						role="listbox"
						data-testid="tid-auto-suggest-options">
						{searchText.length >= 3 ? (
							!autoSuggest.loading && autoSuggest.payload?.length ? (
								children
							) : autoSuggest.loading  && searchText.length <= 30 ? (
								<div className="ncids-autocomplete__menu-item">
									Loading results...
								</div>
							) : (
								<></>
							)
						) : (
							<div className="ncids-autocomplete__menu-item">
								Please enter 3 or more characters
							</div>
						)}
					</div>
				)}
				renderItem={(item, isHighlighted) => (
					<div
						className={`ncids-autocomplete__menu-item ${
							isHighlighted ? 'highlighted' : ''
						}`}
						role="option"
						aria-selected={isHighlighted}
						key={item.termId}>
						<span
							dangerouslySetInnerHTML={{
								__html: emboldenSubstring(item.termName, searchText),
							}}></span>
					</div>
				)}
			/>
			<input
				type="submit"
				className="submit button postfix"
				id="btnSearch"
				title="Search"
				value="Search"
			/>
		</form>
	);
};

Search.propTypes = {
	autoSuggestLimit: PropTypes.number,
};

export default Search;
