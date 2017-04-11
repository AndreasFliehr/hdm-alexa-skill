[![Build Status](https://travis-ci.org/jscheffner/hdm-alexa-skill.svg?branch=master)](https://travis-ci.org/jscheffner/hdm-alexa-skill)
# How to deploy the HdM Alexa Skill#
If you want to deploy this skill on your own Infrastructure using AWS Lamda and the Amazon Developer Console you can do that using the following Instructions

## Configure your own Amazon-Web-Service (AWS) Lambda Function ##
1. Choose Ireland as region since the Alexa Skills Kit is not available for Frankfurt at present. Then create a new Lambda Function using the **Create A Lambda function** Button.

     ![lambda_create.png](https://bitbucket.org/repo/6bxeyX/images/570576051-lambda_create.png)

2. Select the **Blank Function** blueprint since we won't use on any predefined functions

     ![lambda_blueprint.png](https://bitbucket.org/repo/6bxeyX/images/3656192241-lambda_blueprint.png)

3. Select the **Alexa Skills Kit** as the function trigger

     ![lambda_trigger.png](https://bitbucket.org/repo/6bxeyX/images/138716980-lambda_trigger.png)

4. Use the following configurations for the **Configure function** menu:
     1. Define a function name and a description of your choice
     2. Choose the **Node.js 4.3** runtime
     3. Choose **Upload a .ZIP file** as the code entry type and upload a zipped version of the repository code. Be shure you installed the required node modules - stated as dependencies in the package.json file - to the repository before zipping and uploading it.
     4. Create the environment variable **ALEXA_APP_ID** with the App ID value which we will create later in the Amazon Developer Console.
     5. You also need to define a permission role in the **Existing Role** field or create a custom role like Lambda_basic_access and then choose it as existing role.
     6. Leave the other configuration options at their default values.

     ![lambda_configuration.png](https://bitbucket.org/repo/6bxeyX/images/1626128646-lambda_configuration.png)

5. Review and confirm the configuration

## Configure your Amazon Development Console ##

1. Open your Developer Console and create a new Alexa Skill using the **Get Started** menu of the **Alexa Skills Kit**

     ![dev_create.png](https://bitbucket.org/repo/6bxeyX/images/3441174509-dev_create.png)

2. Select the **Add a new Skill** button to create a new Alexa Skill

     ![dev_add_skill.png](https://bitbucket.org/repo/6bxeyX/images/3222543683-dev_add_skill.png)

3. Configure the Skill Information Menu using the information below and click the save button. This will generate the **Application ID** which we use in the Lambda function to explicitly identify our application.

     ![dev_information.png](https://bitbucket.org/repo/6bxeyX/images/2648754973-dev_information.png)

     Note: We use h. d. m. as our **Invocation Name** since the recognition of point separated abbreviation seems to work a lot better.

4. The **Intent Schema** as well as the **Custom Slot Types** and the **Sample Utterance** can be found in the configuration directory of the repository.
The final configuration should look like this:

     ![dev_interaction.png](https://bitbucket.org/repo/6bxeyX/images/3734629936-dev_interaction.png)

5. In the **Configuration** Page select **AWS Lambda ARN (Amazon Resource Name)** as your Service Endpoint Type, choose Europe and enter your ARN from the AWS function which we created earlier.

     ![dev_configuration.png](https://bitbucket.org/repo/6bxeyX/images/1660899815-dev_configuration.png)

## Have Fun with the Skill! ##
You can now test, improve or change the skill to your liking!