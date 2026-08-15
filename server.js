// ======================================================
// PUBLICIDAD ARAIZA
// WPPCONNECT + MONGODB ATLAS
// ======================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 3000;


// ======================================================
// CONFIGURACIÓN
// ======================================================

app.use(cors());

app.use(express.json({
    limit: "10mb"
}));

app.use(
    express.static(__dirname)
);


// ======================================================
// MONGODB
// ======================================================

const MONGO_URI = process.env.MONGO_URI;


if (!MONGO_URI) {

    console.error(
        "❌ No existe MONGO_URI en el archivo .env"
    );

    process.exit(1);

}


mongoose.connect(
    MONGO_URI,
    {
        dbName: "publicidad-araiza"
    }
)
.then(() => {

    console.log("");
    console.log(
        "=========================================="
    );

    console.log(
        "✅ MONGODB CONECTADO CORRECTAMENTE"
    );

    console.log(
        "Base de datos: publicidad-araiza"
    );

    console.log(
        "Colección: grupos"
    );

    console.log(
        "=========================================="
    );

    console.log("");

})
.catch((error) => {

    console.error(
        "❌ Error conectando MongoDB:"
    );

    console.error(
        error.message
    );

});


// ======================================================
// MODELO DE GRUPOS
// ======================================================
//
// Cada grupo tendrá sus asignaciones.
//
// Ejemplo:
//
// {
//   id: "1203...@g.us",
//   nombre: "Grupo clientes",
//   asignaciones: {
//       "1": [1, 7, 8],
//       "2": [3, 4]
//   }
// }
//
// Significa que ese grupo pertenece a:
// Mensaje 1 -> botones 1,7,8
// Mensaje 2 -> botones 3,4
//
// ======================================================

const grupoSchema =
    new mongoose.Schema({

        id: {
            type: String,
            required: true,
            unique: true
        },

        nombre: {
            type: String,
            required: true
        },

        asignaciones: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }

    }, {

        collection: "grupos",

        timestamps: true

    });


const Grupo =
    mongoose.model(
        "Grupo",
        grupoSchema
    );


// ======================================================
// WPPCONNECT
// ======================================================

let client = null;

let conectado = false;

let detenerEnvio = false;


async function iniciarWhatsApp() {

    let wppconnect;

    try {

        wppconnect =
            require(
                "@wppconnect-team/wppconnect"
            );

    }
    catch(error) {

        console.error("");

        console.error(
            "❌ No está instalado WPPConnect."
        );

        console.error("");

        console.error(
            "Ejecuta:"
        );

        console.error(
            "npm install @wppconnect-team/wppconnect"
        );

        console.error("");

        return;

    }


    try {

        console.log("");

        console.log(
            "=========================================="
        );

        console.log(
            "INICIANDO WHATSAPP"
        );

        console.log(
            "=========================================="
        );

        console.log("");


        client =
            await wppconnect.create({

                session:
                    "publicidad-araiza",

                headless:
                    true,

                logQR:
                    true,

                autoClose:
                    0,

                catchQR:
                    (qrCode) => {

                        console.log("");

                        console.log(
                            "📱 ESCANEA EL QR DE WHATSAPP"
                        );

                        console.log("");

                    }

            });


        conectado = true;


        console.log("");

        console.log(
            "🟢 WHATSAPP CONECTADO"
        );

        console.log("");


        client.onStateChange(
            (estado) => {

                console.log(
                    "Estado WhatsApp:",
                    estado
                );


                const estadosMalos = [

                    "CONFLICT",

                    "UNPAIRED",

                    "UNPAIRED_IDLE",

                    "DISCONNECTED"

                ];


                conectado =
                    !estadosMalos.includes(
                        estado
                    );

            }
        );

    }

    catch(error) {

        conectado = false;

        console.error(
            "❌ Error iniciando WhatsApp:"
        );

        console.error(
            error.message
        );

    }

}


iniciarWhatsApp();


// ======================================================
// MENSAJES
// ======================================================

const mensajes = {

    1: {

        imagen:
            "individual.jpeg",

        texto:
`🎬*Venta de cuentas y perfiles Premium*🍿
Plataformas streaming Araiza ✨
💥 *entrega inmediata* 💥

PERFILES 
🪄Disney premium $50
🔹Prime video $35
🔸Vix $25
Vix 6 m $40
Vix 1año $65
🔹Paramount + $25
🔸Crunchyroll $25
◾️Max $35
⚽️Fox One $50
🍎Apple TV $50
🔺Netflix $75 renovables acceso a cod de hogar
🎶Deezer $35
YouTube 3 meses $150
Spotify 1 mes $60
Spotify 3 meses $150
Y más`

    },


    2: {

        imagen:
            "combo1.jpeg",

        texto:
`*PLATAFORMAS STREAMING ARAIZA*
                       *COMBOS*

🥉*Combo Bronce*
• 𝑉𝐼𝑋
• 𝐶𝑅𝑈𝑁𝐶𝐻𝑌𝑅𝑂𝐿𝐿
• PARAMOUNT
💲70

*🥈Combo Plata*
• 𝑃𝑅𝐼𝑀𝐸
• ⁠_Vix_
• 𝑃𝐴𝑅𝐴𝑀𝑂𝑈𝑁𝑇
• 𝐻𝐵𝑂 𝑀𝐴𝑋
💲110

🥇*Combo Oro*
• 𝐷𝑖𝑠𝑛𝑒𝑦
• 𝐻𝑏𝑜 𝑀𝑎𝑥
• 𝑃𝑟𝑖𝑚𝑒 𝑉𝑖𝑑𝑒𝑜
• 𝑃𝑎𝑟𝑎𝑚𝑜𝑢𝑛𝑡
💲130

🪩*Combo Platino*
• 𝑁𝐸𝑇𝐹𝐿𝐼𝑋
• 𝐷𝐼𝑆𝑁𝐸𝑌
• 𝐻𝐵𝑂
💲135

💎*Combo Diamante*
• 𝑁𝑒𝑡𝑓𝑙𝑖𝑥
• 𝐷𝑖𝑠𝑛𝑒𝑦
• 𝐻𝑏𝑜 𝑀𝑎𝑥
• 𝑃𝑟𝑖𝑚𝑒 𝑉𝑖𝑑𝑒𝑜
💲165

🏅*Combo pro*
• 𝑁𝑒𝑡𝑓𝑙𝑖𝑥
• 𝑑𝑖𝑠𝑛𝑒𝑦
• 𝐻𝑏𝑜 𝑀𝑎𝑥
• 𝑃𝑟𝑖𝑚𝑒 𝑉𝑖𝑑𝑒𝑜
• 𝑃𝑎𝑟𝑎𝑚𝑜𝑢𝑛𝑡
💲175

Pregunta con confianza tengo referencias, cuentas garantizada`

    },


    3: {

        imagen:
            "combo5.jpeg",

        texto:
`🎬 PLATAFORMAS STREAMING ARAIZA 🎬

✨ Todo tu entretenimiento en un solo lugar

✅ Cuentas completas y privadas
✅ Solo para usted
✅ Acceso hasta en 5 dispositivos
✅ Plataformas Premium
✅ Vigencia de 1 mes

📦 Nuestros Combos

🟢 ESENCIAL – $300
✔️ Disney+
✔️ Prime Video
✔️ Max
✔️ ViX Premium o Paramount+

🔵 PLUS – $540
✔️ Netflix
✔️ Disney+
✔️ Prime Video
✔️ Max
✔️ ViX Premium o Paramount+

🟣 PREMIUM – $650
✔️ Netflix
✔️ Disney+
✔️ Prime Video
✔️ Max
✔️ ViX Premium
✔️ Paramount+
✔️ Crunchyroll

🟠 ULTRA – $750
✔️ Netflix
✔️ Disney+
✔️ Prime Video
✔️ Max
✔️ Paramount+
✔️ Crunchyroll
✔️ ViX Premium
✔️ Fox One
✔️ IPTV

🎯 COMBO PERSONALIZADO
¡Tú armas tu combo al mejor precio!
Solo escoge tus aplicaciones favoritas y yo te doy un increíble precio.

🚀 Entrega rápida
📲 Compatible con Smart TV, Android, iPhone, PC y Tablet
⚡ Activación el mismo día

📱 Pedidos y más información por WhatsApp:
662 124 3043

🔥 ¡Pregunta por nuestras promociones y arma el combo perfecto para ti!`

    },


    4: {

        imagen:
            null,

        texto:
`*Nuevos servicios*

🧩🗂️ Documentos Disponibles 🗂️🧩
⏰ Horario: 9:00a.m. a 9:00 p.m.

📄 Trámites y Servicios Express:

💖 Actas – $85
(Nacimiento, Matrimonio, Defunción, Divorcio)

💖 Constancia situación fiscal rfc Actualizado

✨ Con RFC – $140
⏳ (1 a 7 horas)

✨ Con ID CIF y RFC – $100
⏳ (20 a 45 minutos)

✨ Clon solo con Curp - $90
⏳ (20 a 45 minutos)

💖 CURP Actualizado – $50
💖 NSS (Seguro Social) – $70
💖 Semanas Cotizadas – $90
✨ Antecedentes no penales $85
✨ LOCALIZAR TU AFORE (saber en institucion o banco esta) $75
✨ Recibo CFE $76

🚨💬 Querida/o cliente, recuerda:
No hay reembolsos si no está verificando tu Curp o documento erróneo`

    },


    5: {

        imagen:
            "peli.jpeg",

        texto:
`🍿*PELICULAS EN MP4*🍿

🍄*Super Mario Galaxy*⭐️💫
🍌*Minions & Monsters*🧟‍♂️
🧸*TOY STORY 5🧸*
🌊*Moana Live Action*🌊

*$15 c/u o $50 por todas*

⚠️Verla sin conexión wifi
⚠️Se manda por WhatsApp por archivo MP4
⚠️Puede verla cuando quiera

💳Pago por transferencia`

    },


    6: {

        imagen:
            "vix.jpeg",

        texto:
            ""

    }

};


// ======================================================
// ESTADO WHATSAPP
// ======================================================

app.get(
    "/api/whatsapp/estado",
    (req, res) => {

        res.json({

            conectado:
                conectado

        });

    }
);


// ======================================================
// OBTENER GRUPOS DE WHATSAPP
// ======================================================

app.get(
    "/api/grupos",
    async (req, res) => {

        if(
            !client ||
            !conectado
        ) {

            return res.status(400).json({

                error:
                    "WhatsApp no está conectado."

            });

        }


        try {
              const chats =
           await client.listChats();


            const gruposWhatsApp =
                chats.filter(
                    chat =>
                        chat.isGroup
                );


            const resultado = [];


            for(
                const grupo of gruposWhatsApp
            ) {

                const id =
                    grupo.id?._serialized
                    ||
                    grupo.id;


                const nombre =
                    grupo.name
                    ||
                    "Grupo sin nombre";


                await Grupo.findOneAndUpdate(

                    { id: id },

                    {

                        $set: {

                            nombre:
                                nombre

                        }

                    },

                    {

                         upsert:
                             true,

                             returnDocument:
                                            "after"

         }

                );


                resultado.push({

                    id:
                        id,

                    nombre:
                        nombre

                });

            }


            res.json(
                resultado
            );

        }

        catch(error) {

            console.error(
                error
            );

            res.status(500).json({

                error:
                    error.message

            });

        }

    }
);


// ======================================================
// OBTENER GRUPOS GUARDADOS EN MONGODB
// ======================================================

app.get(
    "/api/grupos/guardados",
    async (req, res) => {

        try {

            const grupos =
                await Grupo.find({})
                .sort({
                    nombre: 1
                })
                .lean();


            res.json(
                grupos
            );

        }

        catch(error) {

            res.status(500).json({

                error:
                    error.message

            });

        }

    }
);


// ======================================================
// OBTENER ASIGNACIÓN DE UN BOTÓN
// ======================================================

app.get(
    "/api/asignaciones/:mensaje/:boton",
    async (req, res) => {

        try {

            const mensaje =
                Number(
                    req.params.mensaje
                );

            const boton =
                Number(
                    req.params.boton
                );


            const grupos =
                await Grupo.find({

                    [`asignaciones.${mensaje}`]:
                        boton

                }).lean();


            const ids =
                grupos.map(
                    grupo =>
                        grupo.id
                );


            res.json({

                grupos:
                    ids

            });

        }

        catch(error) {

            res.status(500).json({

                error:
                    error.message

            });

        }

    }
);


// ======================================================
// GUARDAR ASIGNACIÓN
// ======================================================

app.put(
    "/api/asignaciones",
    async (req, res) => {

        try {

            const mensaje =
                Number(req.body.mensaje);

            const boton =
                Number(req.body.boton);

            const grupos =
                Array.isArray(req.body.grupos)
                    ? req.body.grupos
                    : [];


            // ------------------------------------------------
            // VALIDAR MENSAJE
            // ------------------------------------------------

            if (
                mensaje < 1 ||
                mensaje > 6
            ) {

                return res.status(400).json({

                    error:
                        "Mensaje inválido."

                });

            }


            // ------------------------------------------------
            // VALIDAR BOTÓN
            // ------------------------------------------------

            if (
                boton < 1 ||
                boton > 32
            ) {

                return res.status(400).json({

                    error:
                        "Botón inválido."

                });

            }


            // ------------------------------------------------
            // MÁXIMO 5 GRUPOS
            // ------------------------------------------------

            if (
                grupos.length > 5
            ) {

                return res.status(400).json({

                    error:
                        "Máximo 5 grupos por botón."

                });

            }


            console.log("");

            console.log(
                "=========================================="
            );

            console.log(
                "GUARDANDO ASIGNACIÓN"
            );

            console.log(
                "Mensaje:",
                mensaje
            );

            console.log(
                "Botón:",
                boton
            );

            console.log(
                "Grupos:",
                grupos.length
            );

            console.log(
                "=========================================="
            );


            // =================================================
            // IMPORTANTE
            //
            // Los grupos asignados a un botón se comparten
            // automáticamente con TODOS LOS MENSAJES.
            //
            // Ejemplo:
            //
            // M1 - B21
            // M2 - B21
            // M3 - B21
            // M4 - B21
            // M5 - B21
            // M6 - B21
            //
            // tendrán los mismos grupos.
            // =================================================


            // ------------------------------------------------
            // PRIMERO QUITAMOS ESTE BOTÓN DE TODOS LOS MENSAJES
            // DE TODOS LOS GRUPOS
            // ------------------------------------------------

            await Grupo.updateMany(

                {},

                {

                    $pull: {

                        "asignaciones.1":
                            boton,

                        "asignaciones.2":
                            boton,

                        "asignaciones.3":
                            boton,

                        "asignaciones.4":
                            boton,

                        "asignaciones.5":
                            boton,

                        "asignaciones.6":
                            boton

                    }

                }

            );


            // ------------------------------------------------
            // AHORA ASIGNAMOS LOS MISMOS GRUPOS
            // A TODOS LOS MENSAJES
            // ------------------------------------------------

            for (
                const id of grupos
            ) {

                await Grupo.updateOne(

                    {
                        id: id
                    },

                    {

                        $set: {

                            [`asignaciones.1`]:
                                await obtenerAsignacionesActuales(
                                    id,
                                    1,
                                    boton,
                                    grupos
                                ),

                            [`asignaciones.2`]:
                                await obtenerAsignacionesActuales(
                                    id,
                                    2,
                                    boton,
                                    grupos
                                ),

                            [`asignaciones.3`]:
                                await obtenerAsignacionesActuales(
                                    id,
                                    3,
                                    boton,
                                    grupos
                                ),

                            [`asignaciones.4`]:
                                await obtenerAsignacionesActuales(
                                    id,
                                    4,
                                    boton,
                                    grupos
                                ),

                            [`asignaciones.5`]:
                                await obtenerAsignacionesActuales(
                                    id,
                                    5,
                                    boton,
                                    grupos
                                ),

                            [`asignaciones.6`]:
                                await obtenerAsignacionesActuales(
                                    id,
                                    6,
                                    boton,
                                    grupos
                                )

                        }

                    },

                    {
                        upsert: true
                    }

                );

            }


            // ------------------------------------------------
            // LA FORMA CORRECTA Y SIMPLE:
            // AGREGAR EL BOTÓN A LOS GRUPOS SELECCIONADOS
            // EN TODOS LOS MENSAJES
            // ------------------------------------------------

            for (
                const id of grupos
            ) {

                await Grupo.updateOne(

                    {
                        id: id
                    },

                    {

                        $addToSet: {

                            "asignaciones.1":
                                boton,

                            "asignaciones.2":
                                boton,

                            "asignaciones.3":
                                boton,

                            "asignaciones.4":
                                boton,

                            "asignaciones.5":
                                boton,

                            "asignaciones.6":
                                boton

                        }

                    },

                    {
                        upsert: true
                    }

                );

            }


            console.log("");

            console.log(
                "✅ ASIGNACIÓN GUARDADA"
            );

            console.log(
                "Botón:",
                boton
            );

            console.log(
                "Grupos:",
                grupos.length
            );

            console.log(
                "➡️ Aplicada a mensajes 1-6"
            );

            console.log("");


            res.json({

                ok:
                    true,

                boton:
                    boton,

                grupos:
                    grupos,

                mensajes:
                    [1, 2, 3, 4, 5, 6]

            });

        }

        catch (error) {

            console.error("");

            console.error(
                "❌ ERROR GUARDANDO ASIGNACIÓN"
            );

            console.error(
                error
            );

            res.status(500).json({

                error:
                    error.message

            });

        }

    }
);

// ======================================================
// OBTENER GRUPOS DE UN BOTÓN
// ======================================================

async function obtenerGruposDeBoton(
    mensaje,
    boton
) {

    const grupos =
        await Grupo.find({

            [`asignaciones.${mensaje}`]:
                boton

        }).lean();


    return grupos;

}


// ======================================================
// ESPERA
// ======================================================

function esperar(
    milisegundos
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milisegundos
            )
    );

}


// ======================================================
// ENVIAR MENSAJE
// ======================================================

app.post(
    "/api/enviar",
    async (req, res) => {

        try {

            const mensaje =
                Number(
                    req.body.mensaje
                );

            const boton =
                Number(
                    req.body.boton
                );


            if(
                !mensajes[mensaje]
            ) {

                return res.status(400).json({

                    error:
                        "Mensaje inválido."

                });

            }


            if(
                boton < 1 ||
                boton > 32
            ) {

                return res.status(400).json({

                    error:
                        "Botón inválido."

                });

            }


            if(
                !client ||
                !conectado
            ) {

                return res.status(400).json({

                    error:
                        "WhatsApp no está conectado."

                });

            }


            const destinos =
                await obtenerGruposDeBoton(
                    mensaje,
                    boton
                );


            if(
                destinos.length === 0
            ) {

                return res.status(400).json({

                    error:
                        "Este botón todavía no tiene grupos asignados."

                });

            }


            if(
                destinos.length > 5
            ) {

                return res.status(400).json({

                    error:
                        "Este botón tiene más de 5 grupos."

                });

            }


            const datos =
                mensajes[mensaje];


            detenerEnvio =
                false;


            res.json({

                ok:
                    true,

                total:
                    destinos.length

            });


            // ------------------------------------------------
            // ENVÍO
            // ------------------------------------------------

            for(
                const grupo of destinos
            ) {

                if(
                    detenerEnvio
                ) {

                    console.log(
                        "⛔ Envío detenido."
                    );

                    break;

                }


                try {

                    console.log("");

                    console.log(
                        "Enviando a:",
                        grupo.nombre
                    );


                    if(
                        datos.imagen
                    ) {

                        const rutaImagen =
                            path.join(
                                __dirname,
                                datos.imagen
                            );


                        await client.sendImage(

                            grupo.id,

                            rutaImagen,

                            datos.imagen,

                            datos.texto || ""

                        );

                    }

                    else {

                        await client.sendText(

                            grupo.id,

                            datos.texto

                        );

                    }


                    console.log(
                        "✅ Enviado:",
                        grupo.nombre
                    );


                    // Pausa entre grupos.
                    // No intenta saltarse límites.
                    await esperar(
                        5000
                    );

                }

                catch(error) {

                    console.error(
                        "❌ Error enviando a:",
                        grupo.nombre
                    );

                    console.error(
                        error.message
                    );

                }

            }


            console.log("");

            console.log(
                "Proceso terminado."
            );

        }

        catch(error) {

            console.error(
                error
            );

        }

    }
);


// ======================================================
// DETENER ENVÍO
// ======================================================

app.post(
    "/api/detener",
    (req, res) => {

        detenerEnvio =
            true;


        res.json({

            ok:
                true

        });

    }
);


// ======================================================
// SERVIDOR
// ======================================================

app.listen(
    PORT,
    () => {

        console.log("");

        console.log(
            "=========================================="
        );

        console.log(
            "      PUBLICIDAD-ARAIZA"
        );

        console.log(
            "=========================================="
        );

        console.log("");

        console.log(
            `🌐 Panel:https://publicidad-araiza-bckend.onrender.com/`
        );

        console.log("");

    }
);
