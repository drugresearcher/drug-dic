Feature: As a user, I would like to have an option to search for a term while viewing the definition page

    Scenario: User is able to see the search box and expand option on the definition page
        Given the user navigates to "def/bevacizumab"
        Then heading "Search NCI's Drug Dictionary" appears
        Then search options for "Starts with" and "Contains" appears
        And "Starts with" radio is selected by default
        And keywords search box appears
        And search button appears beside search box with "Search"
        And "Browse:" appears with A-Z List of Links beside it
        And each option appears as a link

    Scenario Outline: User is able to see autosuggested items when typing 3 or more characters into the search box and has selected "Starts With"
        Given the user navigates to "def/bevacizumab"
        Then "Starts with" radio is selected by default
        And search bar contains a placeholder text "Enter keywords or phrases"
        When user clicks on the search bar
        Then helper text "Please enter 3 or more characters" appears
        When user types "<searchText>" in the search bar
        Then autosuggest appears with highlighting of the text "<searchText>"

        Examples:
            | searchText |
            | bin        |
            | [18        |
            | 50%        |


    Scenario: User is able to see autosuggested items when typing 3 or more characters into the search box and has selected "Contains"
        Given the user navigates to "def/bevacizumab"
        When user selects "Contains" option
        Then search bar contains a placeholder text "Enter keywords or phrases"
        When user clicks on the search bar
        Then helper text "Please enter 3 or more characters" appears
        When user types "2/3" in the search bar
        Then autosuggest appears with highlighting of the text "2/3"



    ##########Analytics############


    Scenario: Analytics click event on A-Z list is raised when user clicks on a letter in the list.
        Given "dictionaryTitle" is set to "NCI Drug Dictionary"
        And "baseHost" is set to "http://localhost:3000"
        And "canonicalHost" is set to "https://www.cancer.gov"
        And "siteName" is set to "National Cancer Institute"
        And "channel" is set to "Publications"
        And "analyticsPublishedDate" is set to "02/02/2011"
        And "analyticsName" is set to "Drug"
        When the user navigates to "def/bevacizumab"
				And the page title is "bevacizumab"
				Then the NCIDataLayer is cleared
        When user selects letter "A" from A-Z list
				Then search results page displays results title "# results found for: A"
				Then there should be an analytics event with the following details
            | key                  | value                           |
            | type                 | Other                           |
            | event                | DrugDictionaryApp:Other:AZClick |
            | linkName             | DrugDictionarySearchAlphaList   |
            | data.dictionaryTitle | NCI Drug Dictionary             |
            | data.analyticsName   | Drug                            |
            | data.letter          | A                               |


    Scenario: When a user clicks on the search button for a starts with search, an analytics click event will be fired.
        Given "dictionaryTitle" is set to "NCI Drug Dictionary"
        And "baseHost" is set to "http://localhost:3000"
        And "canonicalHost" is set to "https://www.cancer.gov"
        And "siteName" is set to "National Cancer Institute"
        And "channel" is set to "Publications"
        And "analyticsPublishedDate" is set to "02/02/2011"
        And "analyticsName" is set to "Drug"
        When the user navigates to "def/bevacizumab"
        And search bar contains a placeholder text "Enter keywords or phrases"
        When user types "bev" in the search bar
        And the user clicks the search button
        Then there should be an analytics event with the following details
            | key                  | value                                 |
            | type                 | Other                                 |
            | event                | DrugDictionaryApp:Other:KeywordSearch |
            | linkName             | DrugDictionarySearch                  |
            | data.dictionaryTitle | NCI Drug Dictionary                   |
            | data.analyticsName   | Drug                                  |
            | data.searchTerm      | bev                                   |
            | data.searchType      | starts with                           |

    Scenario: When a user clicks on the search button for a contains search, an analytics click event will be fired.
        Given "dictionaryTitle" is set to "NCI Drug Dictionary"
        And "baseHost" is set to "http://localhost:3000"
        And "canonicalHost" is set to "https://www.cancer.gov"
        And "siteName" is set to "National Cancer Institute"
        And "channel" is set to "Publications"
        And "analyticsPublishedDate" is set to "02/02/2011"
        And "analyticsName" is set to "Drug"
        When the user navigates to "def/bevacizumab"
        And user selects "Contains" option
        And search bar contains a placeholder text "Enter keywords or phrases"
        When user types "beva" in the search bar
        And the user clicks the search button
        Then there should be an analytics event with the following details
            | key                  | value                                 |
            | type                 | Other                                 |
            | event                | DrugDictionaryApp:Other:KeywordSearch |
            | linkName             | DrugDictionarySearch                  |
            | data.dictionaryTitle | NCI Drug Dictionary                   |
            | data.analyticsName   | Drug                                  |
            | data.searchTerm      | beva                                  |
            | data.searchType      | contains                              |
