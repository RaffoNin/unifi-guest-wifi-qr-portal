# Unifi Wifi Info Portal
Creates a guest portal where users can see guests wifi settings with a QR code to easily join the network. 

**Only works if using Unifi Controller.**

# Features 
  * See wifi password and share to guests via qr code or by copy pasting the text.
  * Change the guest wifi password with api or frontend.

<img width="300" alt="Home-page-dark" src="https://user-images.githubusercontent.com/85386859/177271538-2034b43e-d491-4e78-a39d-fefa495bd0ca.png">              <img width="300" alt="Home-page-light" src="https://user-images.githubusercontent.com/85386859/177274460-f8f807e8-2b66-4917-b890-c2f3f37a7434.png">

## Env variables 
  | Env varibale  | Required | Default Value | Notes
  | ------------- | ------------- | ------------- | ------------- |
  | UNIFI_CONTROLLER_HOST  | true  | **none** | 
  | UNIFI_CONTROLLER_PORT  | true  | **none** |
  | UNIFI_CONTROLLER_USERNAME  | true  | **none** |
  | UNIFI_CONTROLLER_PASSWORD  | true  | **none** |
  | UNIFI_SELECTED_NETWORK_ID  | false  | **none** | *Opens a portal with wifi networks and their IDs if not provided*
  | NEXT_PUBLIC_HEADER_NAME  | false  | **Guest Wifi** | 
  | CHANGE_WIFI_TOKEN | false | **none** | **enables wifi password change ui and api if set**

## Getting Started

### Docker
1. Create a docker container with this image and set the env variables listed above: 
      * Docker run running on port **3030** example:
      ~~~~
      docker run -p 3030:3000 -e UNIFI_CONTROLLER_HOST=* -e UNIFI_CONTROLLER_PORT=* -e UNIFI_CONTROLLER_USERNAME=* 
      -e UNIFI_CONTROLLER_PASSWORD=* -e UNIFI_SELECTED_NETWORK_ID=* nextjs-home-wifi:latest
      ~~~~
      
2. Next steps will depend if you have already set the **UNIFI_SELECTED_NETWORK_ID** env variable or not.
    * **If with UNIFI_SELECTED_NETWORK_ID**: 
        * Open site on port 3030 or any port specified, and the index page ("/") will show the wifi info with the QR code.
    * **If without UNIFI_SELECTED_NETWORK_ID**: 
        * Open site and get, and the index page will show a list of all the wifi networks with their IDs.
        
          <img width="300" alt="Wifi ID List-dark" src="https://user-images.githubusercontent.com/85386859/177272225-e94074e5-5520-48f1-b814-75cf95136899.png"><img width="300" alt="Wifi ID List-light" src="https://user-images.githubusercontent.com/85386859/177274444-aef078a3-1676-4b92-a908-9c46f21f669b.png">


        * Select the wifi, copy its ID, and set the ID as the **UNIFI_SELECTED_NETWORK_ID**.
        * Recreate image with the new env variable, and the index page ("/") will show the wifi info with the QR code.
     
### Running locally 
1. Open the folder directory with terminal.
2. Create a **.env** file at root and insert the environmental variables mentioned above.
3. Do **step 2** of the docker installation instructions above.
4. Run **"yarn build"**
5. Run **"yarn start"**

## Change wifi password 
  * Allows changing selected Wifi network's password
  * *Only available if env variable **CHANGE_WIFI_TOKEN** is provided*
  * The wifi password set under **UNIFI_SELECTED_NETWORK_ID** can be changed via: 
    1. **API** call via **http://[ip]:[port]/api/wifi/change-password**
        * Send a **POST** request with the following body: 
      
      
         | key           |  Notes        |
         | ------------- | ------------- |
         | token         | same as the **CHANGE_WIFI_TOKEN**  |
         | newPassword   | cannnot be less than 8 and more than 63 characters
   
    2. Change the password via the frontend in **http://[ip]:[port]/change-password**
           
        <img width="300" alt="Screen Shot 2022-07-05 at 10 12 26 PM" src="https://user-images.githubusercontent.com/85386859/177348233-fe5bd915-8a38-48d5-b8a2-4cac053882ff.png"> <img width="300" alt="Screen Shot 2022-07-05 at 10 13 55 PM" src="https://user-images.githubusercontent.com/85386859/177348544-f726a7eb-25ea-4c00-89a8-3e1ba77ea703.png">

## Built with
  *  Next js for frontend and the backend
  *  node-unifi package (https://github.com/jens-maus/node-unifi) to get the unifi wifi credentials.
  * Tailwind css for styling

          
