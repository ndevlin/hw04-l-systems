
export default class ExpansionRule
{
    inputLetter: string;

    outputString: string[];

    constructor(inputLetterIn: string, outputStringIn: string[])
    {
        this.inputLetter = inputLetterIn;
        this.outputString = outputStringIn;
    }


    /*
    numExpansions: number;
    // string is the expansion, number is its probability
    allExpansions: [string, number][];

    constructor(expansionsIn: [string, number][])
    {
        this.allExpansions = expansionsIn;
        this.numExpansions = expansionsIn.length;
    }

    returnRandExpansion(randNumIn: number): string
    {
        let randVal: number = 0.0;
        let i: number = 0;

        while(randVal < 1.0 && i < this.numExpansions)
        {
            randVal += this.allExpansions[i][1]
            if(randNumIn < randVal)
            {
                return this.allExpansions[i][0];
            }
            i++;
        }

        return this.allExpansions[0][0];
    }
    */
}

