
export interface Point {
    x: number,
    y: number
}
export interface Line {
    id: string, 
    coords: Point[],
    color: string,
    width: number
}
export interface LineCollection{
    id: string,
    lines: {[key: string]: Line},
    lineIds: string[],
    undoneLines: Line[]
}

export class LinesManager{
    public userLineCollection: {[key: string]: LineCollection};
    public allLinesCollection: {[key: string]: Line};
    private linesAdded: number;

    constructor(){
        this.userLineCollection = {};
        this.allLinesCollection = {};
        this.linesAdded = 0;
    }

    public addNewUser(id:string){
        this.userLineCollection[id] = {
            id: id,
            lines: {},
            lineIds: [],
            undoneLines: []
        }
    }

    public deleteUser(id:string){
        if (this.userLineCollection.hasOwnProperty(id)){
            delete this.userLineCollection[id];
        }
    }

    public addLine(id:string, line:Line){
        if (this.userLineCollection.hasOwnProperty(id)){
            line.id = 'line' + this.linesAdded;
            this.linesAdded++;
            this.userLineCollection[id].lines[line.id] = line;
            this.userLineCollection[id].lineIds.push(line.id);
            this.userLineCollection[id].undoneLines = [];
            this.allLinesCollection[line.id] = line;
            return line;
        }
        return null;
    }

    public deleteLine(id:string, lineId:string){
        if (this.userLineCollection.hasOwnProperty(id) && lineId != null && this.userLineCollection[id].lines.hasOwnProperty(lineId)){
            delete this.userLineCollection[id].lines[lineId];
            let index = this.userLineCollection[id].lineIds.indexOf(lineId);
            this.userLineCollection[id].lineIds.splice(index, 1);
            delete this.allLinesCollection[lineId]; 
        }
        
    }

    public undoLine(id:string){
        if (this.userLineCollection.hasOwnProperty(id) && this.userLineCollection[id].lineIds.length > 0){
            let lineId = this.userLineCollection[id].lineIds.pop();
            delete this.allLinesCollection[lineId]; 
            this.userLineCollection[id].undoneLines.push(this.userLineCollection[id].lines[lineId]);
            delete this.userLineCollection[id].lines[lineId];
        }

    }
    public redoLine(id:string){
        if (this.userLineCollection.hasOwnProperty(id) && this.userLineCollection[id].undoneLines.length > 0){
            let line = this.userLineCollection[id].undoneLines.pop();
            this.userLineCollection[id].lineIds.push(line.id);
            this.userLineCollection[id].lines[line.id] = line;
            this.allLinesCollection[line.id] = line;
        }
    }
}
