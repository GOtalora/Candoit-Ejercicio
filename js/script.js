const app = new Vue ({
    el: '#app',
    data: {
        ciudades: [], 
        climaDeCiudad: [],
        infoAdicional: []
    },
    created : () => {
        fetch("https://ws.smn.gob.ar/map_items/weather")
            .then(function(respt){
                    if(respt.ok){
                                return respt.json()
                            }else{
                                throw new Error()
                            }
                        }).then(function(json){
                            app.ciudades = json;
                            app.inicioDeDatos();
                        }).catch(function(error){
                            console.log(error)
                        }) 
        
    },
    methods: {
        inicioDeDatos(){
            
            this.ciudades.forEach(x => {
                let clima ={
                    fecha_base: x.forecast.date_time.substring(0,10),
                    hora: x.forecast.date_time.substring(11),
                    id: x._id,
                    nombre: x.name,
                    provincia: x.province,
                    temp: x.weather.temp,
                    descripcion: x.weather.description,
                    src: app.mostrarImagen(x.weather.description),
                    humedad: x.weather.humidity,
                    visibilidad: x.weather.visibility,
                    direccionViento: x.weather.wing_deg,
                    velViento: x.weather.wind_speed,
                    pronostico:[]
                };                
                Object.values(x.forecast.forecast).forEach(dia => {
                    let Info = {
                        fecha: dia.date,
                        temp_max: dia.temp_max == null ?"S/D":dia.temp_max,
                        temp_min: dia.temp_min == null ?"S/D":dia.temp_min,
                        mañana: dia.morning.description,
                        tarde: dia.afternoon.description
                    };
                    clima.pronostico.push(Info)
                })
                this.climaDeCiudad.push(clima)
            })
        },
        mostrarInfoAdicional(id){
            
             let aux =[]
            this.climaDeCiudad.forEach(x =>{
                 (x.id == id) ? x.pronostico.filter(y => aux.push(y)) : null
             } )
            if(document.getElementById(id).innerHTML == ""){
                if(aux.length>1)
                   document.getElementById(id).innerHTML += `<p><b>Pronóstico para los siguientes ${aux.length} días</b></p>
                    `
                aux.forEach(x => {
                document.getElementById(id).innerHTML += `
                            <div class = "row text-center dias_pronostico" >
                                <div class = "col-sm-2 subFecha">${x.fecha}</div>
                                <div class="col-sm-1">
                                    <b>Max:</b> ${x.temp_max}°<br><br>
                                    <b>Min:</b> ${x.temp_min}°
                                </div>
                                <div class="col-sm-8">
                                    <b>Por la mañana:</b> ${x.mañana}<br>
                                    <b>Por la tarde:</b> ${x.tarde}
                                </div>
                            <div>`
            })
                
            }
            
            document.getElementById('-'+id).classList.remove("ocultar")
            document.getElementById('+'+id).classList.add("ocultar") 
            document.getElementById(id).classList.remove("ocultar")
        },
        ocultar(id){
            document.getElementById('+'+id).classList.remove("ocultar")
            document.getElementById('-'+id).classList.add("ocultar")
            document.getElementById(id).classList.add("ocultar")
        },
        mostrarImagen(cadena){
            let str = cadena
            str = str.toUpperCase()
            let src = "img/"
            if (str.includes("NUBLADO")){
                if(str.includes("LLUVIA") ||str.includes("LLOVIZNA")){
                    src+= "llovizna.png";
                }else if(str.includes("VIENTO") || str.includes("VENTOSO")){
                    src+= "ventoso-nublado.png";
                }else if(str.includes("NIEBLA")|| str.includes("NEBLINA")){
                    src+= "neblina.png"
                }else
                    src+= "nublado.png";  
                
            }else if(str.includes("LLUVIA") ||str.includes("LLOVIZNA")){
                src+= "lluvia.png";
            }else if(str.includes("VIENTO") ||str.includes("VENTOSO")){
                src+= "viento.png";
            }else if(str.includes("NIEVE") || str.includes("NEVADA")){
                src+= "nieve.png";
            }else if(str.includes("NIEBLA")|| str.includes("NEBLINA")){
                src+= "niebla.png"
            }else if(str.includes("DESPEJADO")){
                src+= "despejado.png"
            }else if(str.includes("CUBIERTO")){
                src+= "cubierto.png"
            }else if(str.includes("TORMENTA")){
                src+= "tormenta.png"
            }else if(str.includes("GRANIZO")){
                src+= "granizo.png"
            }
            return src;
                            
        }
        }
    
})
