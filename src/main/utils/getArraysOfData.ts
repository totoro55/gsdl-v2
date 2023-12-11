const getArraysOfData = (data:Record<string, string|number>[], limit:number):Array<Record<string, string|number>[]> => {
  if (data.length > limit) {
    const count = Math.ceil(data.length / limit)
    const res:Array<Record<string, string|number>[]> = []
    let i = 0
    while (i < count) {
      const start = limit * i
      const end = limit * (i + 1) > data.length ? data.length : limit * (i + 1)
      const dataPack = data.slice(start, end)
      res.push(dataPack)
      i++
    }
    return res
  } else {
    return [data]
  }
}

export default getArraysOfData
