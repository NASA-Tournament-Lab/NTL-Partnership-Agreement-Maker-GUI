# nasa-pam

# Prequsites
 - NodeJS
 - bower

# Pugins Used
  - Richtext editor plugin: [https://www.tinymce.com](https://www.tinymce.com/)

# Installation
 - bower install
 - then host on local server.

## GSFC 
  ### Display flag for GFSC messages 
  - Uplate ```config.json``` file as:
  ```json
  isGFSCRouting: false  //hides the GFSC messages
  isGFSCRouting: true //displays the GFSC messages
  ```

 #### Pages affected:
  - create-new-routing-package-add-dist-options.html  
  - create-new-routing-package-add-reviewers.html  


## "Save and Send" button
### Display flag for "Save and Send" button
  - Uplate ```config.json``` file as:
  ```json
  isDisabledSaveAndSend: false  //hides the "Save and Send" button
  isDisabledSaveAndSend: true //displays the "Save and Send" button
  ```
#### Pages affected:
  - create-new-routing-package-add-dist-options.html

## Validation
 - please ignore validation error due to vendor prefixes.
 
##508 compliance checker:
please use https://www.powermapper.com/products/sortsite/checks/accessibility-checks/ as mentioned in forum.
In the "Accessibility" section of tool's report,you will see there is no issues mentioned in Requirement.
