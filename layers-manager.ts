import { Line, LineCollection } from "./lines-manager";



export class LayersMangager{
    public layersCollection: {[key:string]:{[key:string]:Line}};
    public opacity: number;   
    private layersAdded: number;
    
    
    constructor(){
        this.layersCollection = {};
        this.opacity = 100;
        this.layersAdded= 0;
    }


    public addLayer(){
        let id = 'layer' + this.layersAdded;
        this.layersAdded++;
        this.layersCollection[id] = {};
    }
    public addLine(line:Line){
        if (this.layersCollection.hasOwnProperty(line.layerId)){
            this.layersCollection[line.layerId][line.id] = line;
        }
    }
    public deleteLine(layerId:string, lineId:string){
        if (this.layersCollection.hasOwnProperty(layerId) && this.layersCollection[layerId].hasOwnProperty(lineId)){
            delete this.layersCollection[layerId][lineId];
        }
    }









}