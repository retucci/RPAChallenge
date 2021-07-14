const inputFormsController = require("../controller/inputFormsController");
const inputForms = require("../model/inputFormsDTO");

module.exports = {
    run: async function(){
        try{
            await inputFormsController.openURLBase();
            await inputFormsController.awaitPageLoad();
            await inputFormsController.downloadXls();
            await inputFormsController.sleep(5000); //TODO: Remover sleep e verificar download completado
            await inputFormsController.start();
            await inputFormsController.awaitPageLoad();
            let jsonXls = await inputFormsController.loadXlsPath();
            if(jsonXls != null && jsonXls.length > 0)
            {
                 for(const obj of jsonXls){
     
                     let inputs = new inputForms(obj["First Name"],
                                                 obj["Last Name "],
                                                 obj["Company Name"],
                                                 obj["Role in Company"],
                                                 obj["Address"],
                                                 obj["Email"],
                                                 obj["Phone Number"]);
     
                     let promises = Object.keys(inputs).map((prop) => inputFormsController.setInputText(prop,inputs[prop]));
                     await Promise.all(promises);
     
                     await inputFormsController.nextStep();
                     await inputFormsController.awaitPageLoad();
                 }
             }
             else
                 console.log('Não foi possível recuperar XLS');    
         }catch {
             console.log('Erro ao executar');
         }
    }
}