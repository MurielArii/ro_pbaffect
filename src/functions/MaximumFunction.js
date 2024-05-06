export default function MaximumFunction(strArr) {
    const OptimalAssignments = (strArr) => {
        const matrix = strArr.map(row => row.slice(1, -1).split(',').map(Number))
        return complement(matrix)
    }

    // complement
    const complement = (matrix) => {
        const max = Math.max(...matrix.flat())
        const new_array = matrix.map(row => row.map(num => max - num));
        return hungarian(new_array);
    }

    const hungarian = (matrix) => {
        let state = {
            rows_covered: matrix.map(_ => false),
            columns_covered: matrix[0].map(_ => false),
            starred: matrix.map(row => row.map(_ => 0)),
            start: undefined,
            path: undefined,
        }

        zero(matrix)
        let step = starZeroes(matrix, state)
        while (typeof step === 'function') {
            step = step(matrix, state)
        }
        const result = getResult(matrix, state)
        return result
    }

    // step 1
    const zero = (matrix) => {
        columnsZeroed(matrix)
        // rowsZeroed(matrix)
    }

    // step 2
    const starZeroes = (matrix, state) => {
        matrix.forEach((row, rowIndex) =>
            row.forEach((value, columnIndex) => {
                if (value !== 0) return
                if (isCoveredRow(state, rowIndex)) return
                if (isCoveredColumn(state, columnIndex)) return
                starZero(state, [rowIndex, columnIndex])
            })
        )
        clearCovers(state)
        return coverStarredColumns
    }

    // step 3
    const coverStarredColumns = (matrix, state) => {
        matrix.forEach((row, rowIndex) => {
            row.forEach((_, columnIndex) => {
                if (state.starred[rowIndex][columnIndex] === 1) {
                    coverColumn(state, columnIndex)
                }
            })
        })
        if (state.columns_covered.every(covered => covered)) {
            return // done!
        }
        return primeZeroes
    }

    // step 4
    const primeZeroes = (matrix, state) => {
        while (true) {
            const [rowIndex, columnIndex] = findUncoverdZero(matrix, state)
            if (rowIndex === -1) return augment
            state.starred[rowIndex][columnIndex] = 2
            const starredColumn = findStarInRow(matrix, state, rowIndex)
            if (starredColumn > -1) {
                coverRow(state, rowIndex)
                unCoverColumn(state, starredColumn)
            } else {
                state.start = [rowIndex, columnIndex]
                return createPath
            }
        }
    }

    // step 5
    const createPath = (matrix, state) => {
        let step = 0
        const path = [state.start]
        let done = false
        while (!done) {
            const rowIndex = findStarInColumn(matrix, state, path[step][1])
            if (rowIndex === -1) {
                done = true
            } else {
                step++
                path.push([rowIndex, path[step - 1][1]])
            }
            if (!done) {
                const columnIndex = findPrimeInRow(matrix, state, path[step][0])
                step++
                path.push([path[step - 1][0], columnIndex])
            }
        }
        state.path = path;
        convertPath(state)
        clearCovers(state)
        clearPrimes(state)
        return coverStarredColumns
    }

    // step 6
    const augment = (matrix, state) => {
        const min = findSmallestUncovered(matrix, state)

        matrix.forEach((row, rowIndex) =>
            row.forEach((_, columnIndex) => {
                if (isCoveredRow(state, rowIndex)) {
                    matrix[rowIndex][columnIndex] += min
                }
                if (!isCoveredColumn(state, columnIndex)) {
                    matrix[rowIndex][columnIndex] -= min
                }
            })
        )
        return primeZeroes
    }

    const getResult = (matrix, state) => {
        return getStarredZeroes(matrix, state)
            .map(([row, column]) => [row + 1, column + 1])
    }

    const starZero = (state, position) => {
        const [rowIndex, columnIndex] = position
        state.starred[rowIndex][columnIndex] = 1
        coverRow(state, rowIndex)
        coverColumn(state, columnIndex)
    }

    const coverRow = (state, row) => {
        state.rows_covered[row] = true
    }

    const isCoveredRow = (state, row) => {
        return state.rows_covered[row]
    }

    const coverColumn = (state, column) => {
        state.columns_covered[column] = true
    }

    const unCoverColumn = (state, column) => {
        state.columns_covered[column] = false
    }

    const isCoveredColumn = (state, column) => {
        return state.columns_covered[column]
    }

    const getStarredZeroes = (matrix, state) => {
        return matrix.reduce((acc, row, i) => {
            return row.reduce((acc, _, j) => {
                if (state.starred[i][j] === 1) {
                    return [...acc, [i, j]]
                }
                return acc
            }, acc)
        }, [])
    }

    const rowsZeroed = (matrix) => {
        matrix.forEach((row, x) => {
            const min = Math.min(...row)
            row.forEach((_, y) => matrix[x][y] -= min)
        })
    }

    const columnsZeroed = (matrix) => {
        const minColValues = matrix.map((_, x) => Math.min(...matrix.map(row => row[x])))
        matrix.forEach((row, x) =>
            row.forEach((_, y) => matrix[x][y] -= minColValues[y])
        )
    }

    const clearCovers = (state) => {
        state.rows_covered = state.rows_covered.map(_ => false)
        state.columns_covered = state.columns_covered.map(_ => false)
    }

    const clearPrimes = (state) => {
        state.starred.forEach((row, rowIndex) =>
            row.forEach((value, columnIndex) => {
                if (value === 2) {
                    state.starred[rowIndex][columnIndex] = 0
                }
            })
        )
    }

    const findPrimeInRow = (matrix, state, rowIndex) => {
        return matrix[rowIndex].reduce((acc, _, columnIndex) => {
            if (state.starred[rowIndex][columnIndex] === 2) return columnIndex
            return acc
        }, -1)
    }

    const findStarInRow = (matrix, state, rowIndex) => {
        return matrix[rowIndex].reduce((acc, _, columnIndex) => {
            if (acc !== -1) return acc
            if (state.starred[rowIndex][columnIndex] === 1) return columnIndex
            return acc
        }, -1)
    }

    const findStarInColumn = (matrix, state, columnIndex) => {
        return matrix.reduce((acc, _, rowIndex) => {
            if (state.starred[rowIndex][columnIndex] === 1) return rowIndex
            return acc
        }, -1)
    }


    const findUncoverdZero = (matrix, state) => {
        return matrix.reduce((acc, row, rowIndex) =>
            row.reduce((acc, num, columnIndex) => {
                if (acc[0] !== -1) return acc
                if (num !== 0) return acc
                if (isCoveredColumn(state, columnIndex) || isCoveredRow(state, rowIndex)) return acc
                return [rowIndex, columnIndex]
            }, acc), [-1, -1])
    }

    const rowsWithZero = (matrix) => {
        return matrix.map(row => row.every(num => num !== 0))
    }

    const columnsWithZero = (matrix) => {
        return matrix[0].map((_, i) => matrix.every(row => row[i] !== 0))
    }

    const convertPath = (state) => {
        state.path.forEach(([rowIndex, columnIndex]) => {
            if (state.starred[rowIndex][columnIndex] === 1) {
                state.starred[rowIndex][columnIndex] = 0
            } else {
                state.starred[rowIndex][columnIndex] = 1
            }
        })
    }

    const findSmallestUncovered = (matrix, state) => {
        return matrix.reduce((acc, row, rowIndex) =>
            row.reduce((acc, num, columnIndex) => {
                if (isCoveredColumn(state, columnIndex) || isCoveredRow(state, rowIndex)) return acc
                return num < acc ? num : acc
            }, acc)
            , parseInt(Number.MAX_SAFE_INTEGER / 2))
    }

    return OptimalAssignments(strArr);
}
