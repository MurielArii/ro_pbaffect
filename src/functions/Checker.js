class Checker {
    containsZero = (array) => {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                if (array[i][j] <= 0) {
                    return true;
                }
            }
        }
        return false;
    }
}

export default new Checker();