eel.get_photo()(async function(data){
    console.log(data)

    const id = data[0]
    const photo_path = data[1]
    const kind = data[2]
    const date = data[3]
    const place = data[4]
    const latittude = data[5]
    const longitude = data[6]
    const camera = data[7]
    const group_id = data[8]

    document.getElementById("name_ru").innerHTML = FileSystemFileHandle
    let names = await eel.set_value()()
    console.log(names)
})