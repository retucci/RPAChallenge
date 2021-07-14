const {Builder, By, Key, util, until} = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const fs =  require('fs');
const xlsx = require('xlsx');
const appRoot = require('app-root-path');

const urlBase = "http://rpachallenge.com";
const downloadPath = appRoot + '\\download'

const chromePrefs = { 'download.default_directory': downloadPath};
const chromeOptions = new chrome.Options().setUserPreferences(chromePrefs);
const driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();

module.exports = {
    openURLBase: async function(){
        try{
            await driver.get(urlBase);
        }catch {
            console.log('Erro ao abrir página principal');
        }
    },

    setInputText: async function (input,text){
        try{
            await driver.findElement(By.css("input[ng-reflect-name='"+input+"']")).sendKeys(text);
        }catch {
            console.log('Erro ao preencher campo:'+ input);
        }
    },
    
    start: async function (){
        try{
            await driver.findElement(By.css("button[class='waves-effect col s12 m12 l12 btn-large uiColorButton']")).click();
        }catch {
            console.log('Erro ao clicar no start');
        }
    },
    
    nextStep: async function (){
        try{
            await driver.findElement(By.css("input[type='submit']")).click();
        }catch {
            console.log('Erro ao clicar na próxima etapa');
        }
    },
    
    awaitPageLoad: async function (){
        try{
            return driver.executeScript('return document.readyState').then(function(readyState) {
                return readyState === 'complete';
              });
        }catch {
            console.log('Erro ao aguardar carregamento da página');
        }
    },
    
    downloadXls: async function (){
        try{
            var path =  downloadPath + '\\challenge.xlsx';
            if(!fs.existsSync(path))
            {
                await driver.get(urlBase+ "/assets/downloadFiles/challenge.xlsx");
            }
        }catch {
            console.log('Erro ao realizar download');
        }
    },

    sleep:async function(miliseconds)
    {
        try{
            await driver.sleep(miliseconds);
        }catch
        {
            console.log('Erro aguardar');
        }
    },
    
    loadXlsPath: async function (){
        try{
            var path =  downloadPath + '\\challenge.xlsx';

            if(fs.existsSync(path)){
            var workbook = xlsx.readFile(path);
            var sheet_name_list = workbook.SheetNames;
            var xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            return xlData;
        }
        else
            return null;

        }catch {
           console.log('Erro ao ler XLS');
        }
    }
}