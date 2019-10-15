# primo-explore-problem-reporting
The "Report a problem" button is a customisation implemented by the University of Manchester (UoM) that enables users to report to the Library team when there might be a problem accessing an online resource provided by the UoM Primo search.  An example of this behaviour can be viewed e.g. [here](https://www.librarysearch.manchester.ac.uk/discovery/fulldisplay?docid=alma992975872443101631&context=L&vid=44MAN_INST:MU_NUI&lang=en&search_scope=MyInst_and_CI&adaptor=Local%20Search%20Engine&tab=Everything&query=any,contains,graphene&offset=0).  

This document outlines the customisations employed in the generation of a "Report a problem" button as implemented by the University of Manchester.  This implementation is by no means generic and is specific to the (non-standard) University of Manchester Primo customisation architecture.  However, this code is provided with the aim of giving insight into how such a feature might be implemented by interested parties.  This implementation builds upon the Primo guidance located at: [https://github.com/ExLibrisGroup/primo-explore-devenv](https://github.com/ExLibrisGroup/primo-explore-devenv).  

## Architecture
In conformance with existing Primo standards, relevant files are placed in the *css*, *html* and *js* folders respectively.  
- The implementation utilises the Primo *prmAlmaViewitAfter* hook to display the button and form.  
- Adhering to the Primo instructions, the item controller is defined in js (*InlineEResourcesReportAProblemController*)  
- Depending upon the desired conditions (defined in the controller js file), the button is displayed or not.  
- The template for the controller is defined in a separate (html) file - *inlineEResourcesReportAProblem.html* - (and pointed to by the controller). This is what displays the form.  
- In line with primo standards, custom CSS is added in the css file.  
- The specific implementation utilised here calls out to another UoM (*gateway*) service (API endpoint) in order to retrieve certain users details (e.g. email address) not immediately provided by Alma and also to process the form and send an email to the relevant team.  This is an independent system that sits entirely outside of Primo.  This will have to be developed separately by anyone wishing to mimic this behaviour exactly.  
