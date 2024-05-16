export interface Grammar {
  title:      string;
  level:      number;
  content:    Content[];
  subcontent: Grammar[];
}

export interface Content {
  type:  Type;
  value: string;
}

export enum Type {
  List = "list",
  Text = "text",
}

export default [
    {
      "title": "TO BE",
      "level": 1,
      "content": [],
      "subcontent": [
        {
          "title": "ORACIONES AFIRMATIVAS",
          "level": 3,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: Estructura: SUJETO + VERBO TO BE + COMPLEMENTOS "
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; I am Spanish; Yo soy española "
            }
          ],
          "subcontent": []
        },
        {
          "title": "ORACIONES NEGATIVAS",
          "level": 3,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: SUJETO + VERBO TO BE + NOT + COMPLEMENTOS "
            },
            {
              "type": "list",
              "value": "Ej: falta; They are not teachers; Ellos no son profesores. "
            },
            {
              "type": "list",
              "value": "Ej: falta; Michael is not Chinese; Michael no es chino "
            }
          ],
          "subcontent": []
        },
        {
          "title": "ORACIONES INTERROGATIVAS",
          "level": 3,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: VERBO TO BE + SUJETO + COMPLEMENTOS? "
            },
            {
              "type": "list",
              "value": "Ej: falta; Are you Japanese? ¿Eres japonés? "
            },
            {
              "type": "list",
              "value": "Ej: falta; Is Margaret German? ¿Margaret es alemana? "
            }
          ],
          "subcontent": [
            {
              "title": "Respuesta corta afirmativa",
              "level": 4,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: Yes, Sujeto(en forma de pronombre)+ Verbo "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Is she Italian? Yes, she is (¿Ella es italiana? Sí, si lo es) "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Are Peter and Philip Portuguese? Yes, they are "
                }
              ],
              "subcontent": []
            },
            {
              "title": "Respuesta corta negativa",
              "level": 4,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: No, Sujeto(pronombre) + Verbo + Not (forma contracta) "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Are you doctors? No, we aren’t; falta "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Is John British? No, he isn’t; falta"
                }
              ],
              "subcontent": []
            }
          ]
        }
      ]
    },
    {
      "title": "Word question",
      "level": 1,
      "content": [
        {
          "type": "structure",
          "value": "Estructura: QUESTION WORD + VERBO TO BE + SUJETO + COMPLEMENTOS? "
        },
        {
          "type": "list",
          "value": "Ej: falta; falta; falta"
        },
        {
          "type": "text",
          "value": "What"
        },
        {
          "type": "text",
          "value": "Qué/Cuál /   Se utiliza para hablar de cosas."
        },
        {
          "type": "list",
          "value": "Ej: falta; falta; falta"
        },
        {
          "type": "text",
          "value": "Which"
        },
        {
          "type": "text",
          "value": "Qué/Cuál / Se utiliza para preguntar sobre opciones / Antecedente de cosas o animales."
        },
        {
          "type": "list",
          "value": "Ej: Where are you from? I am from Spain"
        },
        {
          "type": "text",
          "value": "Where"
        },
        {
          "type": "text",
          "value": "Dónde / Se utiliza para hablar de lugares."
        },
        {
          "type": "list",
          "value": "Ej: falta; falta; falta"
        },
        {
          "type": "text",
          "value": "When"
        },
        {
          "type": "text",
          "value": "Cuándo / Se utiliza para hablar de tiempo."
        },
        {
          "type": "list",
          "value": "Ej: falta; falta; falta"
        },
        {
          "type": "text",
          "value": "Who"
        },
        {
          "type": "text",
          "value": "Quién / Se utiliza para hablar de personas"
        },
        {
          "type": "list",
          "value": "Ej: falta; falta; falta"
        },
        {
          "type": "text",
          "value": "Whom"
        },
        {
          "type": "text",
          "value": "A quién / Se utiliza para hablar de personas. (objeto del verbo)"
        },
        {
          "type": "list",
          "value": "Ej: falta; falta; falta"
        },
        {
          "type": "text",
          "value": "Whose"
        },
        {
          "type": "text",
          "value": "De quién, Cuyo / Se utiliza para hablar de posesión."
        },
        {
          "type": "list",
          "value": "Ej: falta; falta; falta"
        },
        {
          "type": "text",
          "value": "Why"
        },
        {
          "type": "text",
          "value": "Por qué\tSe utiliza para hablar de razones o causas."
        },
        {
          "type": "list",
          "value": "Ej: falta; falta; falta"
        },
        {
          "type": "text",
          "value": "How"
        },
        {
          "type": "text",
          "value": "Cómo / Se utiliza para hablar sobre un proceso."
        }
      ],
      "subcontent": []
    },
    {
      "title": "THERE IS / THERE ARE: HAY ",
      "level": 1,
      "content": [
        {
          "type": "text",
          "value": "THERE IS: Singular "
        },
        {
          "type": "text",
          "value": "THERE ARE: Plural "
        }
      ],
      "subcontent": [
        {
          "title": "ORACIONES AFIRMATIVAS",
          "level": 3,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: THERE IS/ ARE + COMPLEMENTOS: "
            },
            {
              "type": "list",
              "value": "Ej: falta; There is a new boy in my classroom; falta"
            }
          ],
          "subcontent": []
        },
        {
          "title": "ORACIONES NEGATIVAS",
          "level": 3,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: THERE IS/ ARE NOT + COMPLEMENTOS: "
            },
            {
              "type": "list",
              "value": "Ej: falta; There aren’t books on the table; falta"
            }
          ],
          "subcontent": []
        },
        {
          "title": "ORACIONES INTERROGATIVAS",
          "level": 3,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: IS / ARE THERE + COMPLEMENTOS?: "
            },
            {
              "type": "list",
              "value": "Ej: falta; Is there an empty chair here?; falta"
            }
          ],
          "subcontent": []
        }
      ]
    },
    {
      "title": "ARTÍCULOS ",
      "level": 1,
      "content": [
        {
          "type": "text",
          "value": "A / AN: Artículo indeterminado: Un/Una /Uno "
        },
        {
          "type": "text",
          "value": "Se utiliza cuando es la primera vez que nombramos un objeto, únicamente se utiliza con objetos contables  en singular, se utiliza tanto para masculino como para femenino. "
        },
        {
          "type": "list",
          "value": "Ej: Quiero afirmar que soy **una** niña; I am a girl; Soy una niña"
        },
        {
          "type": "list",
          "value": "Ej: Quiero afirmar que Peter es **un** niño; Peter is a boy; Peter es un niño "
        },
        {
          "type": "text",
          "value": "Utilizamos **AN** en lugar de A cuando la siguiente palabra empieza por **vocal**. "
        },
        {
          "type": "list",
          "value": "Ej: Quiero afirmar que es un elefante; It is **an** elephant; Es un elefante "
        },
        {
          "type": "text",
          "value": "Es obligatorio el uso del artículo indeterminado delante de las **profesiones** en singular. "
        },
        {
          "type": "list",
          "value": "Ej: falta; Jane is **a** teacher; Jane es profesora "
        }
      ],
      "subcontent": []
    },
    {
      "title": "ADJETIVOS ",
      "level": 1,
      "content": [
        {
          "type": "text",
          "value": "• No tienen género. "
        },
        {
          "type": "text",
          "value": "• Nunca llevan plural, el plural lo lleva el sustantivo al que acompañan. "
        },
        {
          "type": "list",
          "value": "Ej: falta; Peter and Helen are **happy**; Peter y Helen son felices. "
        },
        {
          "type": "list",
          "value": "Ej: falta; Peter is **happy**; Peter es feliz. "
        },
        {
          "type": "text",
          "value": "• El adjetivo siempre va delante del sustantivo. "
        },
        {
          "type": "list",
          "value": "Ej: falta; The English girl is **thin**; La niña inglesa es delgada "
        },
        {
          "type": "list",
          "value": "Ej: falta; The red car is **new**; El coche rojo es nuevo "
        }
      ],
      "subcontent": []
    },
    {
      "title": "CONJUGACIÓN DEL VERBO TO HAVE Y ESTRUCTURAS ",
      "level": 1,
      "content": [],
      "subcontent": [
        {
          "title": "ORACIONES AFIRMATIVAS",
          "level": 2,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: SUJETO + VERBO TO HAVE + COMPLEMENTOS "
            },
            {
              "type": "list",
              "value": "Ej: falta; I have got a big house; Tengo una casa grande "
            }
          ],
          "subcontent": []
        },
        {
          "title": "ORACIONES NEGATIVAS",
          "level": 2,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: SUJETO + HAVE/HAS NOT GOT + COMPLEMENTOS "
            },
            {
              "type": "list",
              "value": "Ej: falta; You have not got a dog; Tú no tienes un perro "
            }
          ],
          "subcontent": []
        },
        {
          "title": "ORACIONES INTERROGATIVAS",
          "level": 2,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: HAVE/HAS + SUJETO + GOT + COMPLEMENTOS? "
            },
            {
              "type": "list",
              "value": "Ej: falta; Have you got an American friend?; ¿Tienes un amigo Americano? "
            }
          ],
          "subcontent": []
        }
      ]
    },
    {
      "title": "ADJETIVOS / PRONOMBRES DEMOSTRATIVOS",
      "level": 1,
      "content": [],
      "subcontent": [
        {
          "title": "SINGULAR",
          "level": 2,
          "content": [
            {
              "type": "list",
              "value": "* THIS: ESTE/ ESTA/ESTO: (Para referirse a objetos cercanos al hablante) "
            },
            {
              "type": "list",
              "value": "* THAT: ESE/ ESA/ ESO / AQUEL/AQUELLA/AQUELLO (Objetos que están lejos de la persona que habla) "
            }
          ],
          "subcontent": []
        },
        {
          "title": "PLURAL",
          "level": 2,
          "content": [
            {
              "type": "list",
              "value": "* THESE: ESTOS / ESTAS (Objetos cercanos) "
            },
            {
              "type": "list",
              "value": "* THOSE: ESOS/ ESAS/ AQUELLOS/AQUELLAS (Objetos lejanos) "
            }
          ],
          "subcontent": []
        },
        {
          "title": "Pronombres",
          "level": 2,
          "content": [
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "His"
            },
            {
              "type": "text",
              "value": "su, sus (masculino)"
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "Her"
            },
            {
              "type": "text",
              "value": "su, sus (femenino)"
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "Its"
            },
            {
              "type": "text",
              "value": "su, sus"
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "Their"
            },
            {
              "type": "text",
              "value": "su, sus (de ellos)"
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "Me (objeto)"
            },
            {
              "type": "text",
              "value": "me, mí I want it for me. Lo quiero para mí. "
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "You (objeto)"
            },
            {
              "type": "text",
              "value": "te, tu, tí, usted I 'm helping you. Te estoy ayudando a tí. "
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "Him (objeto)"
            },
            {
              "type": "text",
              "value": "él, le, lo Can you see him? Le puedes ver? "
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "Her (objeto)"
            },
            {
              "type": "text",
              "value": "ella, le, la She is pretty. I like her. Ella es bonita. Me gusta ella. "
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "It (objeto)"
            },
            {
              "type": "text",
              "value": "lo, la, ello, le Give it a kick. Dale una patada. "
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "Us (objeto)"
            },
            {
              "type": "text",
              "value": "nosotros, nos He is helping us. Él nos está ayudando "
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "You (objeto)"
            },
            {
              "type": "text",
              "value": "vosotros, les, ustedes, os I saw you. Les vi. "
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "Them (objeto)"
            },
            {
              "type": "text",
              "value": "ellos, les, los, las, I 'm waiting for them. Los estoy esperando."
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "Mine"
            },
            {
              "type": "text",
              "value": "mío/s, mía/s"
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "Theirs"
            },
            {
              "type": "text",
              "value": "suyo/a, suyos/as (de ellos )"
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "Themselves"
            },
            {
              "type": "text",
              "value": "ellos mismos, se"
            },
            {
              "type": "text",
              "value": "| P. Personales | A. Posesivos | P. Posesivos | P. Objeto |"
            },
            {
              "type": "text",
              "value": "| ---- | ---- | ---- | ---- |"
            },
            {
              "type": "text",
              "value": "| I | MY | MINE | ME |"
            },
            {
              "type": "text",
              "value": "| YOU | YOUR | YOURS | YOU |"
            },
            {
              "type": "text",
              "value": "| HE | HIS | HIS | HIM |"
            },
            {
              "type": "text",
              "value": "| SHE | HER | HERS | HER |"
            },
            {
              "type": "text",
              "value": "| IT | ITS | ----- | IT |"
            },
            {
              "type": "text",
              "value": "| WE | OUR | OURS | US |"
            },
            {
              "type": "text",
              "value": "| YOU | YOUR | YOURS | YOU |"
            },
            {
              "type": "text",
              "value": "| THEY | THEIR | THEIRS | THEM |"
            }
          ],
          "subcontent": []
        }
      ]
    },
    {
      "title": "GENITIVO SAJON ",
      "level": 1,
      "content": [
        {
          "type": "text",
          "value": "Indicaremos quién es el poseedor o dueño de algún objeto"
        },
        {
          "type": "structure",
          "value": "Estructura: PERSONA + 'S + POSECIÓN (cosa de, familiar de)"
        },
        {
          "type": "list",
          "value": "Ej: falta; The girl’s house; La casa de la niña"
        },
        {
          "type": "list",
          "value": "Ej: falta; My brother’s room;  La habitación de mi hermano"
        },
        {
          "type": "list",
          "value": "Ej: falta; The cat’s eyes; Los ojos del gato"
        },
        {
          "type": "list",
          "value": "Ej: falta; Juan’s sister; La hermana de Juan"
        },
        {
          "type": "list",
          "value": "Ej: falta; Peter’s parents; Los padres de Peter"
        }
      ],
      "subcontent": []
    },
    {
      "title": "TIEMPOS VERBALES ",
      "level": 1,
      "content": [],
      "subcontent": [
        {
          "title": "PRESENTE CONTINUO",
          "level": 2,
          "content": [
            {
              "type": "text",
              "value": "Se utiliza para expresar acciones que se están realizando en este momento, en el momento en que estamos hablando, o periodos de tiempo que aún no han terminado."
            },
            {
              "type": "text",
              "value": "Va acompañado de expresiones de tiempo como NOW, AT THE MOMENT, AT PRESENT, TODAY, THIS WEEK. "
            },
            {
              "type": "structure",
              "value": "Estructura: VERBO TO BE + VERBO PRINCIPAL + ING "
            }
          ],
          "subcontent": [
            {
              "title": "O. AFIRMATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: SUJETO + TO BE+ VB+ING + COMPLEMENTOS: "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; I am learning English at the moment; falta"
                }
              ],
              "subcontent": []
            },
            {
              "title": "O. NEGATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: SUJETO + TO BE+NOT+ VB+ING+COMPLEMENTOS: "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; We are not learning Chinese this year; falta"
                }
              ],
              "subcontent": []
            },
            {
              "title": "O. INTERROGATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: (WH- WORD) +VB TO BE+ SUJETO + VB + ING + COMPLEMENTOS: "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Are you learning Italian now? What are you doing?; falta"
                }
              ],
              "subcontent": []
            }
          ]
        },
        {
          "title": "ING SPELLING",
          "level": 2,
          "content": [
            {
              "type": "text",
              "value": "• Verbos que acaban en –E: Pierde la E y añadimos –ing: Mak**e** – Making "
            },
            {
              "type": "text",
              "value": "• Verbos que acaban en – IE: IE se transforma en Y, añadimos ing: D**ie** _ Dying "
            },
            {
              "type": "text",
              "value": "• Verbos de una sílaba formada por consonante – vocal –consonante: Doblan la última consonante y añaden – ing: **Put** – Putting ? //TODO: buscar mas información"
            },
            {
              "type": "text",
              "value": "• Verbos que acaban en –Y y –W: Mantienen Y y W y añaden –ing: Enjo**y**-enjo**y**ing , sno**w** – sno**w**ing."
            }
          ],
          "subcontent": []
        },
        {
          "title": "PRESENTE SIMPLE",
          "level": 2,
          "content": [
            {
              "type": "text",
              "value": "Se utiliza  para expresar acciones que se realizan  habitualmente, **acciones** que realizamos todos los  días. Rutinas, hábitos.  Utilizaremos el verbo auxiliar TO DO, para las oraciones negativas e interrogativas. (DOES PARA LA 3ª PERSONA) "
            },
            {
              "type": "text",
              "value": "Las oraciones  afirmativas  no necesitan  auxiliar, sin  embargo  añadiremos  una  S al verbo en la tercera persona del singular. "
            },
            {
              "type": "text",
              "value": "Suele ir acompañado de expresiones de tiempo como EVERYDAY y adverbios de frecuencia como ALWAYS, USUALLY, OFTEN, SOMETIMES, NEVER."
            }
          ],
          "subcontent": [
            {
              "title": "O. AFIRMATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: SUJETO + VERBO + COMPLEMENTOS "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; I play football everyday; falta"
                },
                {
                  "type": "text",
                  "value": "Recuerda añadir la **S** al verbo en la 3ª persona del singular, únicamente en las oraciones afirmativas. "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; He alway**s** drink**s** coffee for breakfast; falta"
                }
              ],
              "subcontent": []
            },
            {
              "title": "O. NEGATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: SUJETO + DON’T / DOESN’T + VERBO + COMPLEMENTOS "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; You don’t speak Spanish; falta"
                },
                {
                  "type": "list",
                  "value": "Ej: falta; He doesn’t play the piano; falta"
                },
                {
                  "type": "text",
                  "value": "Como verás no hemos añadido S en la 3ª persona, ya que tenemos el auxiliar DOES que ya nos esa 3ª persona. "
                }
              ],
              "subcontent": []
            },
            {
              "title": "O. INTERROGATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: DO/DOES + SUJETO + VERBO + COMPLEMENTOS? "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Do you like chocolate?; falta"
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Does she read French books?; falta"
                },
                {
                  "type": "text",
                  "value": "La respuesta corta para estas preguntas se forma con el sujeto, en forma de pronombre + el verbo auxiliar DO / DOES "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Do you live in Madrid? Yes, I do, falta"
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Does it rain here? No, it doesn’t; falta"
                }
              ],
              "subcontent": []
            },
            {
              "title": "ADVERBIOS DE FRECUENCIA",
              "level": 3,
              "content": [
                {
                  "type": "text",
                  "value": "ALWAYS : SIEMPRE"
                },
                {
                  "type": "text",
                  "value": "OFTEN: A MENUDO"
                },
                {
                  "type": "text",
                  "value": "NEVER: NUNCA"
                },
                {
                  "type": "text",
                  "value": "USUALLY: NORMALMENTE"
                },
                {
                  "type": "text",
                  "value": "SOMETIMES: A VECES"
                },
                {
                  "type": "text",
                  "value": "Tienen una posición fija dentro de las oraciones: Siempre se colocan delante del verbo principal, excepto con el verbo "
                },
                {
                  "type": "text",
                  "value": "TO BE, con el que van detrás. "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; I never get up late; falta"
                },
                {
                  "type": "list",
                  "value": "Ej: falta; He is always happy; falta"
                }
              ],
              "subcontent": []
            }
          ]
        },
        {
          "title": "PASADO DEL VERBO TO BE ",
          "level": 2,
          "content": [
            {
              "type": "text",
              "value": "Aparece con expresiones de tiempo como YESTERDAY, LAST WEEK, LAST MONTH, LAST YEAR."
            }
          ],
          "subcontent": [
            {
              "title": "O. AFIRMATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: SUJETO +  VERBO TO BE + COMPLEMENTOS "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; I was in England last month; falta"
                }
              ],
              "subcontent": []
            },
            {
              "title": "O. NEGATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: SUJETO + VERBO TO BE + NOT + COMPLEMENTOS "
                },
                {
                  "type": "list",
                  "value": "Ej: falta, I was not in Germany last month; falta"
                }
              ],
              "subcontent": []
            },
            {
              "title": "O. INTERROGATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: VERBO TO BE + SUJETO + COMPLEMENTOS? "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Were you in Japan last month?; falta"
                }
              ],
              "subcontent": []
            }
          ]
        },
        {
          "title": "PASADO SIMPLE",
          "level": 2,
          "content": [
            {
              "type": "text",
              "value": "Se utiliza para expresar acciones puntuales en el pasado. "
            },
            {
              "type": "text",
              "value": "Aparece con expresiones como YESTERDAY, LAST WEEK... "
            },
            {
              "type": "text",
              "value": "Necesitamos el verbo auxiliar DID para las oraciones negativas e interrogativas. "
            },
            {
              "type": "text",
              "value": "Existen dos tipos de verbos en inglés: Verbos regulares y verbos irregulares. Los verbos regulares forman el pasado "
            },
            {
              "type": "text",
              "value": "añadiendo ED al infinitivo. Los verbos irregulares tienen una forma especial para el pasado (2ª columna de los "
            },
            {
              "type": "text",
              "value": "verbos irregulares). "
            }
          ],
          "subcontent": [
            {
              "title": "O. AFIRMATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: SUJETO + VERBO PASADO + COMPLEMENTOS. "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; I played tennis last Saturday; falta"
                },
                {
                  "type": "list",
                  "value": "Ej: falta; I went to the cinema last Sunday; falta"
                },
                {
                  "type": "text",
                  "value": "Las oraciones afirmativas son las únicas que llevan el verbo en pasado, ya que no utilizamos verbo auxiliar. "
                }
              ],
              "subcontent": []
            },
            {
              "title": "O. NEGATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: SUJETO + DID NOT ( DIDN’T) + VB INFINITIVO + COMPLEMENTOS "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; I didn’t play tennis last Saturday; falta"
                },
                {
                  "type": "list",
                  "value": "Ej: falta; I didn’t go to the cinema last Sunday; falta"
                }
              ],
              "subcontent": []
            },
            {
              "title": "O. INTERROGATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: DID + SUJETO + VB INFINITIVO + COMPLEMENTOS? "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Did you play tennis last Saturday?; falta"
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Did you go to the cinema last Sunday?; falta"
                }
              ],
              "subcontent": []
            }
          ]
        },
        {
          "title": "PASADO CONTINUO",
          "level": 2,
          "content": [
            {
              "type": "text",
              "value": "• Se forma con el pasado del verbo TO BE + Verbo principal con ing. "
            },
            {
              "type": "text",
              "value": "• Se utiliza para expresar acciones que se han desarrollado durante un periodo largo de tiempo en el pasado. "
            },
            {
              "type": "text",
              "value": "• Suele combinarse con el pasado simple dentro de la misma oración, la acción del verbo que va en pasado continuo  es  la  que  estaba  teniendo  lugar  cuando  se  ve  interrumpida  por  una  segunda  acción  en  pasado simple. "
            },
            {
              "type": "list",
              "value": "Ej: falta; I was watching TV when the telephone rang; falta"
            },
            {
              "type": "list",
              "value": "Ej: falta; Past continuous Past simple; falta"
            }
          ],
          "subcontent": [
            {
              "title": "O. AFIRMATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: SUJETO + WAS/WERE + VB ING + COMPLEMENTOS: "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; I was having a bath when my cat came in; Estaba bañándome cuando mi gato entró"
                }
              ],
              "subcontent": []
            },
            {
              "title": " O. NEGATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: SUJETO + WASN’T / WEREN’T + VB ING + COMPLEMENTOS: "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; I wasn’t driving very fast when the accident happened; No estaba conduciendo muy rápido cuando ocurrió el accidente"
                }
              ],
              "subcontent": []
            },
            {
              "title": "O. INTERROGATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: WAS / WERE + SUJETO + VB ING + COMPLEMENTOS? "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Were you studying when I knocked on the door?; ¿Estabas estudiando cuando llamé a la puerta?"
                }
              ],
              "subcontent": []
            }
          ]
        }
      ]
    },
    {
      "title": "COMPARATIVES AND SUPERLATIVES ",
      "level": 1,
      "content": [],
      "subcontent": [
        {
          "title": "COMPARATIVO DE IGUALDAD",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "TAN …………………………………. COMO "
            },
            {
              "type": "text",
              "value": "AS  + ADJETIVO + AS "
            },
            {
              "type": "list",
              "value": "Ej: falta; Peter is as tall as Paul; Peter es tan alto como Paul"
            },
            {
              "type": "text",
              "value": "Siempre que la segunda parte de la comparación sea un pronombre, este debe aparecer en la forma de pronombre objeto. "
            },
            {
              "type": "list",
              "value": "Ej: falta; Sarah is as thin as him; falta"
            }
          ],
          "subcontent": []
        },
        {
          "title": "COMPARATIVO DE SUPERIORIDAD",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "MÁS ………………………….QUE "
            },
            {
              "type": "list",
              "value": "- Adjetivos de dos sílabas o menos. "
            },
            {
              "type": "text",
              "value": "ADJETIVO + ER + THAN "
            },
            {
              "type": "list",
              "value": "Ej: falta; John is taller than Paul; John es más alto que Paul"
            },
            {
              "type": "list",
              "value": "- Adjetivos de más de dos sílabas. "
            },
            {
              "type": "text",
              "value": "MORE + ADJETIVO + THAN "
            },
            {
              "type": "list",
              "value": "Ej: falta; Susan is more intelligent than Mary; Susan es más inteligente que Mary"
            }
          ],
          "subcontent": []
        },
        {
          "title": "SUPERLATIVO",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "EL MÁS / LA MÁS………………………. "
            },
            {
              "type": "list",
              "value": "- Adjetivos de dos sílabas o menos. "
            },
            {
              "type": "text",
              "value": "THE ADJETIVO + EST "
            },
            {
              "type": "list",
              "value": "Ej: falta; He is the tallest boy; El niño más alto"
            },
            {
              "type": "text",
              "value": "Si queremos indicar en que lugar es el que destaca ese adjetivo al que estamos refiriéndonos en grado superlativo utilizaremos la preposición IN THE, si es una expresión de tiempo utilizaremos OF THE. "
            },
            {
              "type": "list",
              "value": "Ej: falta; Susan is the thinnest girl in the school. "
            },
            {
              "type": "list",
              "value": "Ej: falta; This is the happiest day of my life; falta"
            },
            {
              "type": "text",
              "value": "Adjetivos de más de dos sílabas: "
            }
          ],
          "subcontent": []
        },
        {
          "title": "THE MOST + ADJETIVO ",
          "level": 3,
          "content": [
            {
              "type": "list",
              "value": "Ej: falta; Peter is the most intelligent student in the classroom; falta"
            },
            {
              "type": "list",
              "value": "Ej: falta; Today is the most important day of the year; falta"
            }
          ],
          "subcontent": []
        },
        {
          "title": "ADJETIVOS IRREGULARES ",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "Good Better The Best "
            },
            {
              "type": "text",
              "value": "Bad Worse The Worst "
            },
            {
              "type": "text",
              "value": "Far Farther/ Further The Farthest/ the furthest "
            }
          ],
          "subcontent": []
        }
      ]
    },
    {
      "title": "PREPOSICIONES DE TIEMPO",
      "level": 1,
      "content": [
        {
          "type": "text",
          "value": "//TODO: explicar "
        }
      ],
      "subcontent": [
        {
          "title": "IN",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "• Con partes del día: In the morning, in the afternoon, in the evening "
            },
            {
              "type": "text",
              "value": "• Con meses: In January, in February…… "
            },
            {
              "type": "text",
              "value": "• Con las estaciones del año: In winter, in spring…. "
            },
            {
              "type": "text",
              "value": "• Con años: In 1987 "
            },
            {
              "type": "text",
              "value": "• Con siglos: In the 18 th   century **"
            }
          ],
          "subcontent": []
        },
        {
          "title": "ON",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "• Con los días de la semana: On Monday, on Tuesday….. "
            },
            {
              "type": "text",
              "value": "• Con fechas: On 2nd  of May "
            },
            {
              "type": "text",
              "value": "• Con días y partes del día: On Wednesday afternoon. "
            },
            {
              "type": "text",
              "value": "• En vacaciones: On holidays. "
            }
          ],
          "subcontent": []
        },
        {
          "title": "AT",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "• Con las horas: At 7 o’clock "
            },
            {
              "type": "text",
              "value": "• At Christmas, at Easter "
            },
            {
              "type": "text",
              "value": "• At night "
            },
            {
              "type": "text",
              "value": "• At the weekend "
            },
            {
              "type": "text",
              "value": "• At the beginning, at the end. "
            }
          ],
          "subcontent": []
        },
        {
          "title": "LUGAR",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "IN: EN / DENTRO DE: Con lugares cerrados "
            },
            {
              "type": "text",
              "value": "Ej: My coat is in the wardrobe "
            },
            {
              "type": "text",
              "value": "AT: EN : Se utiliza para espacios abiertos, como referencia geográfica "
            },
            {
              "type": "text",
              "value": "Ej: There are new traffic lights at the crossroads. "
            },
            {
              "type": "text",
              "value": "ON: EN / ENCIMA (Tocando la superficie) "
            },
            {
              "type": "text",
              "value": "Ej: There are pictures on the wall. "
            }
          ],
          "subcontent": []
        },
        {
          "title": "OTRAS PREPOSICIONES DE TIEMPO",
          "level": 2,
          "content": [
            {
              "type": "text",
              "value": "BEFORE: ANTES"
            },
            {
              "type": "text",
              "value": "AFTER: DESPUES "
            },
            {
              "type": "text",
              "value": "UNTIL: HASTA "
            },
            {
              "type": "text",
              "value": "DURING: DURANTE ( DURING + SUSTANTIVOS: Se utiliza con expresiones que respondan a la pregunta WHEN?) "
            },
            {
              "type": "list",
              "value": "Ej: falta; During the summer, during November; falta"
            },
            {
              "type": "text",
              "value": "FOR: DURANTE ( DURING + NÚMEROS + PERIODOS DE TIEMPO: Se utiliza con expresiones que respondan a la pregunta HOW LONG?. "
            },
            {
              "type": "list",
              "value": "Ej: falta; For six months, for five minutes; falta"
            },
            {
              "type": "text",
              "value": "SINCE: DESDE "
            },
            {
              "type": "text",
              "value": "FROM …………….. TO: DESDE ……………. HASTA:  Se utiliza tanto como preposición de tiempo como de lugar. "
            },
            {
              "type": "list",
              "value": "Ej: falta; I lived in London from 1987 to 1989; falta"
            },
            {
              "type": "list",
              "value": "Ej: falta; There is one train from Madrid to Valencia at 7 o’clock; falta"
            }
          ],
          "subcontent": []
        },
        {
          "title": "OTRAS PREPOSICIONES DE LUGAR:",
          "level": 2,
          "content": [
            {
              "type": "text",
              "value": "NEXT TO: AL LADO DE "
            },
            {
              "type": "text",
              "value": "CLOSE TO: JUNTO A "
            },
            {
              "type": "text",
              "value": "NEAR: CERCA DE "
            },
            {
              "type": "text",
              "value": "FAR (AWAY FROM): LEJOS DE "
            },
            {
              "type": "text",
              "value": "BEHIND: DETRÁS "
            },
            {
              "type": "text",
              "value": "IN FRONT OF: DELANTE DE "
            },
            {
              "type": "text",
              "value": "OPPOSITE: ENFRENTE DE "
            },
            {
              "type": "text",
              "value": "OVER: ENCIMA DE ( Sin tocar la superficie) "
            },
            {
              "type": "text",
              "value": "UNDER: DEBAJO DE "
            },
            {
              "type": "text",
              "value": "INSIDE: DENTRO DE "
            },
            {
              "type": "text",
              "value": "OUTSIDE: FUERA DE "
            },
            {
              "type": "text",
              "value": "BETWEEN: ENTRE "
            },
            {
              "type": "text",
              "value": "AT HOME: EN CASA. Ej: I don’t go out, I stay at home. "
            },
            {
              "type": "text",
              "value": "IN BED: EN LA CAMA "
            },
            {
              "type": "text",
              "value": "GO HOME, GET HOME, COME HOME, REACH HOME,ARRIVE HOME (Observa que no utilizamos preposiciones con "
            },
            {
              "type": "text",
              "value": "la palabra HOME acompañada de verbos de movimiento). "
            },
            {
              "type": "text",
              "value": "ARRIVE: "
            },
            {
              "type": "list",
              "value": "* ARRIVE IN : Llegar a paises, ciudades...."
            },
            {
              "type": "list",
              "value": "* Ej: falta; I arrived in London; falta"
            },
            {
              "type": "list",
              "value": "* ARRIVE AT: LLegar a espacios cerrados: estaciones, museos, Aeropuertos.... "
            },
            {
              "type": "list",
              "value": "Ej: falta; I arrived at the airport; falta"
            }
          ],
          "subcontent": []
        }
      ]
    },
    {
      "title": "EXPRESIÓN DE CANTIDAD:",
      "level": 1,
      "content": [],
      "subcontent": [
        {
          "title": "SOME",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "Algún, alguna, algunos, algunas. "
            },
            {
              "type": "text",
              "value": "Se utiliza en oraciones afirmativas. "
            },
            {
              "type": "text",
              "value": "Acompaña a nombres incontables (singular) y nombres contables en plural. "
            },
            {
              "type": "list",
              "value": "Ej: falta; There is some water in the fridge; falta"
            },
            {
              "type": "list",
              "value": "Ej: falta; There are some new students in the school; falta"
            }
          ],
          "subcontent": []
        },
        {
          "title": "ANY",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "Algún/a/os/as, ningún /a/os/as. "
            },
            {
              "type": "text",
              "value": "Se utiliza en oraciones negativas e interrogativas. "
            },
            {
              "type": "text",
              "value": "Acompaña a nombres incontables (singular) y nombres contables (plural) "
            },
            {
              "type": "list",
              "value": "Ej: falta: There isn’t any apple  juice in the cupboard; falta"
            },
            {
              "type": "list",
              "value": "Ej: falta; Have you  got any friends?; falta"
            }
          ],
          "subcontent": []
        },
        {
          "title": "SOME en oraciones interrogativas",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "Aunque he indicado anteriormente que utilizamos ANY en oraciones interrogativas, existen algunas excepciones en las "
            },
            {
              "type": "text",
              "value": "que utilizamos SOME para hacer preguntas: "
            },
            {
              "type": "text",
              "value": "• Cuando estamos ofreciendo algo: "
            },
            {
              "type": "list",
              "value": "Ej: falta; Would you like some coffee?; falta"
            },
            {
              "type": "text",
              "value": "• Cuando pedimos algo: "
            },
            {
              "type": "list",
              "value": "Ej: falta; Can I have some water, please?; falta"
            }
          ],
          "subcontent": []
        },
        {
          "title": "Otros",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "**MUCH**: MUCHO: NOMBRES INCONTABLES "
            },
            {
              "type": "text",
              "value": "( No se utiliza habitualmente en oraciones afirmativas) "
            },
            {
              "type": "list",
              "value": "Ej: falta; I haven’t got much money; falta"
            },
            {
              "type": "text",
              "value": "**MANY**: MUCHO: NOMBRES CONTABLES. "
            },
            {
              "type": "text",
              "value": "(Se utiliza en todo tipo de oraciones) "
            },
            {
              "type": "list",
              "value": "Ej: falta; I have got many books; falta"
            },
            {
              "type": "text",
              "value": "**TOO MUCH / TOO MANY**: DEMASIADO "
            },
            {
              "type": "text",
              "value": "HOW MUCH / HOW MANY? ¿CUÁNTOS?"
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "**A LOT OF**: MUCHO: CONTABLES E INCONTABLES: "
            },
            {
              "type": "text",
              "value": "( Se utiliza en todo tipo de oraciones) "
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "**LITTLE**: POCO: NOMBRES INCONTABLES. "
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "**A LITTLE**: ALGO, POCO PERO SUFICIENTE. "
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "**FEW**: POCO: NOMBRES CONTABLES. "
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            },
            {
              "type": "text",
              "value": "**A FEW**: ALGO, POCO PERO SUFICIENTE"
            },
            {
              "type": "list",
              "value": "Ej: falta; falta; falta"
            }
          ],
          "subcontent": []
        }
      ]
    },
    {
      "title": "VERB TENSES",
      "level": 1,
      "content": [],
      "subcontent": [
        {
          "title": "PRESENT PERFECT",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "• Se forma con el verbo TO HAVE (que funciona como verbo auxiliar) + el participio de pasado del verbo principal. ( Recuerda que hay dos tipos de verbos en inglés: verbos regulares, que forman el participio añadiendo –ed al infinitivo, y verbos irregulares, en este caso el participio de pasado es la tercera columna de la lista de verbos. "
            },
            {
              "type": "text",
              "value": "• Se utiliza para expresar acciones que empezaron en el pasado y continúan en el presente, o si bien la acción ya ha acabado, el resultado de la misma lo vemos en el presente. "
            }
          ],
          "subcontent": []
        },
        {
          "title": "O. AFIRMATIVAS",
          "level": 3,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: SUJETO + HAVE/HAS + PARTICIPIO PASADO VB + COMPLEMENTOS: "
            },
            {
              "type": "list",
              "value": "Ej: falta; I work in a bank. I have worked there for 10 years; Trabajo en un banco. He trabajado allí durante 10 años"
            }
          ],
          "subcontent": []
        },
        {
          "title": "O. NEGATIVAS",
          "level": 3,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: SUJETO + HAVEN’T / HASN’T  + PART. PASADO VB + COMPLEMENTOS "
            },
            {
              "type": "list",
              "value": "Ej: falta; She is reading a book. She hasn’t finished it yet; Ella está leyendo un libro. No lo ha terminado todavía"
            }
          ],
          "subcontent": []
        },
        {
          "title": "O. INTERROGATIVAS",
          "level": 3,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: HAVE / HAS + SUJETO + PART. PASADO VB + COMPLEMENTOS? "
            },
            {
              "type": "list",
              "value": "Ej: falta; Have you ever been to London?; ¿Has estado alguna vez en Londres?"
            },
            {
              "type": "text",
              "value": "Suele aparecer con expresiones de tiempo como SINCE, FOR ( En respuesta a preguntas con HOW LONG?) "
            },
            {
              "type": "list",
              "value": "Ej: falta; I have worked here since 1976; falta"
            },
            {
              "type": "list",
              "value": "Ej: falta; How long have you met him? I have met him for several years; falta"
            },
            {
              "type": "text",
              "value": "Otras expresiones de tiempo que aparecen con el PRESENT PERFECT: "
            }
          ],
          "subcontent": []
        },
        {
          "title": "JUST: ACABO DE ",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "Se utiliza en oraciones afirmativas y va colocado delante del verbo principal. "
            },
            {
              "type": "list",
              "value": "Ej: falta; Have you seen Paul? He has just arrived; ¿Has visto a Paul? Acaba de llegar. "
            }
          ],
          "subcontent": []
        },
        {
          "title": "ALREADY: YA ",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "Se utiliza en oraciones afirmativas y va colocado delante del verbo principal: "
            },
            {
              "type": "list",
              "value": "Ej: falta; Would you like to see Titanic? I’m sorry, I’ve already seen it; ¿Te gustaría ver Titanic? Lo siento, ya la he visto"
            }
          ],
          "subcontent": []
        },
        {
          "title": "YET: TODAVIA NO ",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "Se utiliza en oraciones negativas, y va colocado al final de la oración: "
            },
            {
              "type": "list",
              "value": "Ej: falta; Have you read the book? No, I’m sorry, I haven’t started it yet; ¿Has leído el libro? No, lo siento, no lo he empezado todavía"
            }
          ],
          "subcontent": []
        },
        {
          "title": "EVER: ¿ALGUNA VEZ? ",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "Se utiliza en oraciones interrogativas, va colocado delante del verbo principal: "
            },
            {
              "type": "list",
              "value": "Ej: falta; Have you ever tried Japanese food? No, not yet; ¿ Has probado alguna vez la comida japonesa? No, todavía no"
            }
          ],
          "subcontent": []
        },
        {
          "title": "SOMEBODY/ SOMEONE ( ALGUIEN) y SOMETHING (ALGUNA COSA) ",
          "level": 3,
          "content": [
            {
              "type": "text",
              "value": "son 3ª persona del singular, tienen que ir por tanto seguidos de HAS. "
            },
            {
              "type": "text",
              "value": "//TODO: pendiente"
            }
          ],
          "subcontent": []
        }
      ]
    },
    {
      "title": "PAST PERFECT",
      "level": 1,
      "content": [
        {
          "type": "text",
          "value": "Se forma con **HAD** (para todas las personas) + el participio de pasado del verbo principal (recuerda los verbos regulares e irregulares) "
        },
        {
          "type": "text",
          "value": "Se utiliza para expresar acciones pasadas que terminaron antes de que "
        },
        {
          "type": "text",
          "value": "otra acción pasada empezara. Suele combinarse por tanto con el pasado "
        },
        {
          "type": "text",
          "value": "simple, encontraremos entonces dos acciones: "
        },
        {
          "type": "text",
          "value": "1ª: Acción terminada: Past Perfect "
        },
        {
          "type": "text",
          "value": "2ª: Acción que empezó cuando ya había acabado la anterior: S. Past "
        },
        {
          "type": "list",
          "value": "Ej: falta; The concert had started when we arrived at the theatre; falta"
        },
        {
          "type": "text",
          "value": "Past Perfect Simple Past "
        }
      ],
      "subcontent": [
        {
          "title": "O. AFIRMATIVAS",
          "level": 3,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: SUJETO + HAD + PARTICIPIO PASADO VB + COMPLEMENTOS: "
            },
            {
              "type": "list",
              "value": "Ej: falta; I arrived at the airport when the plane had taken off; Llegué al aeropuerto cuando el avión había despegado"
            }
          ],
          "subcontent": []
        },
        {
          "title": "O. NEGATIVAS",
          "level": 3,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: SUJETO + HADN’T + PARTICIPIO PASADO VB + COMPLEMENTOS: "
            },
            {
              "type": "list",
              "value": "Ej: falta; The shop hadn’t closed when I arrived; La tienda no había cerrado cuando llegué"
            }
          ],
          "subcontent": []
        },
        {
          "title": "O. INTERROGATIVAS",
          "level": 3,
          "content": [
            {
              "type": "structure",
              "value": "Estructura: HAD + SUJETO + PARTICIPIO PASADO VB + COMPLEMENTOS?"
            },
            {
              "type": "list",
              "value": "Ej: falta; Had you finished the book when you gave it back?; ¿Habías acabado el libro cuando lo devolviste?"
            }
          ],
          "subcontent": []
        }
      ]
    },
    {
      "title": "FUTURE",
      "level": 1,
      "content": [
        {
          "type": "text",
          "value": "Hay dos tipos de futuro en inglés: "
        }
      ],
      "subcontent": [
        {
          "title": "Futuro con WILL ",
          "level": 2,
          "content": [
            {
              "type": "text",
              "value": "(que funciona como auxiliar, y se utiliza en o. afirmativas, negativas e interrogativas) "
            },
            {
              "type": "list",
              "value": "- Se utiliza cuando el sujeto no tiene control sobre el futuro. "
            },
            {
              "type": "list",
              "value": "- Para expresar decisiones tomadas en el momento. "
            },
            {
              "type": "list",
              "value": "- A través de este futuro expresamos imprevistos, predicciones,  lo que el "
            },
            {
              "type": "text",
              "value": "sujeto cree que ocurrirá. "
            },
            {
              "type": "list",
              "value": "- Aparece con expresiones de tiempo como TOMORROW, NEXT WEEK, "
            },
            {
              "type": "text",
              "value": "NEXT MONTH, NEXT YEAR. "
            }
          ],
          "subcontent": [
            {
              "title": "O. AFIRMATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: SUJETO + WILL + VB (INFINITIVO) + COMPLEMENTOS: "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; It will rain tomorrow; Lloverá mañana"
                }
              ],
              "subcontent": []
            },
            {
              "title": "O. NEGATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: SUJETO + WILL NOT (WON’T) + VB (INFINIT)+COMPLEMENTOS: "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; It will not rain tomorrow; No lloverá mañana"
                }
              ],
              "subcontent": []
            },
            {
              "title": "O. INTERROGATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: WILL + SUJETO + VB(INFINITIVO) + COMPLEMENTOS? "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Will it rain tomorrow?; ¿Lloverá mañana?"
                }
              ],
              "subcontent": []
            }
          ]
        },
        {
          "title": "Futuro con TO BE GOING TO",
          "level": 2,
          "content": [
            {
              "type": "text",
              "value": "(el verbo To be es el que funciona como auxiliar, y es por tanto el que vamos a conjugar, se utiliza en o. afirmativas, negativas e interrogativas) "
            },
            {
              "type": "text",
              "value": "Utilizamos este tipo de futuro cuando el sujeto tiene control absoluto sobre la acción. "
            },
            {
              "type": "text",
              "value": "Es un futuro planeado de antemano, y para que esa acción se lleve o no a   cabo, el sujeto ha tomado las medidas oportunas. Expresamos con este futuro intenciones y decisiones. "
            },
            {
              "type": "text",
              "value": "Predicciones basadas en hechos presentes. "
            }
          ],
          "subcontent": [
            {
              "title": "O. AFIRMATIVAS. ",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: SUJETO + TO BE  + GOING TO + VB (INFINITIVO) + COMPLEMENTOS: "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; (I have this blue velvet) I am going to make a new dress; Tengo este terciopelo azul)  Voy a hacerme un vestido Nuevo"
                }
              ],
              "subcontent": []
            },
            {
              "title": "O. NEGATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: SUJETO + TO BE NOT + GOING TO + VB (INFINIT) + COMPLEMENTOS: "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; I am not going to make a new dress; falta"
                }
              ],
              "subcontent": []
            },
            {
              "title": "O. INTERROGATIVAS",
              "level": 3,
              "content": [
                {
                  "type": "structure",
                  "value": "Estructura: TO BE + SUJETO + GOING TO + VB (INFINIT) + COMPLEMENTOS? "
                },
                {
                  "type": "list",
                  "value": "Ej: falta; Are you going to make a new dress?: falta"
                },
                {
                  "type": "text",
                  "value": "//TODO: pendiente"
                },
                {
                  "type": "text",
                  "value": "Compare  these situations and read what I would say in each case: Use will / going to: "
                },
                {
                  "type": "text",
                  "value": "“You make your friend a cup of sweet coffee, then she tells you she doesn’t take sugar”. Offer to make her another one. "
                },
                {
                  "type": "text",
                  "value": "I’ll make you another cup of coffee ( Decisión tomada en el momento, es por eso que utilizamos futuro con WILL) "
                },
                {
                  "type": "text",
                  "value": "“ A colleague asks you why you have brought your sports kit to the "
                },
                {
                  "type": "text",
                  "value": "office. “ Explain that you have arranged to play tennis after work. "
                },
                {
                  "type": "text",
                  "value": "I am going to play tennis after work ( Decisión tomada de antemano, por "
                },
                {
                  "type": "text",
                  "value": "eso traes el equipo a la oficina, futuro con TO BE GOING TO)"
                }
              ],
              "subcontent": []
            }
          ]
        }
      ]
    },
    {
      "title": "CONDITIONAL SENTENCES. (ORACIONES CONDICIONALES) ",
      "level": 1,
      "content": [
        {
          "type": "text",
          "value": "Recuerda que en una oración condicional siempre hay dos partes. "
        },
        {
          "type": "text",
          "value": "En inglés hay tres tipos de oraciones condicionales: "
        }
      ],
      "subcontent": [
        {
          "title": "CONDICIONALES DE TIPO 1 : PROBABLES ",
          "level": 2,
          "content": [
            {
              "type": "text",
              "value": "Hay un 100 % de posibilidades de que la condición se cumpla si se cumple una de las partes de la condición: "
            },
            {
              "type": "text",
              "value": "IF + PRESENTE / FUTURO "
            },
            {
              "type": "list",
              "value": "Ej: falta; if you phone me I will go to the cinema; falta"
            },
            {
              "type": "text",
              "value": "(La parte del IF puede ir al principio o al final, pero siempre seguido de presente si se trata de una condicional de tipo "
            }
          ],
          "subcontent": []
        },
        {
          "title": "CONDICIONALES DE TIPO 2: IMPROBABLES ",
          "level": 2,
          "content": [
            {
              "type": "text",
              "value": "Las posibilidades de que se cumpla la condición se reducen a un 50%. "
            },
            {
              "type": "text",
              "value": "IF + PASADO SIMPLE / WOULD + INFINITIVO "
            },
            {
              "type": "text",
              "value": "COULD  + INFINITIVO "
            },
            {
              "type": "list",
              "value": "Ej: falta; If I know your address I would visit you; falta"
            },
            {
              "type": "list",
              "value": "Ej: falta; I had money I could travel all over the world; falta"
            }
          ],
          "subcontent": []
        },
        {
          "title": "CONDICIONALES TIPO 3: IMPOSIBLES ",
          "level": 2,
          "content": [
            {
              "type": "text",
              "value": "No  existe  ninguna  posibilidad  de  que  se  cumpla  la  condición,  la  situación  ha  tenido  lugar  en  el  pasado  y  no  hay "
            },
            {
              "type": "text",
              "value": "posibilidad de cambiar el pasado. "
            },
            {
              "type": "text",
              "value": "IF + PAST PERFECT / WOULD HAVE + PAST PARTICIPLE "
            },
            {
              "type": "list",
              "value": "Ej: falta; If you had studied more you would have passed the exam; falta"
            }
          ],
          "subcontent": []
        }
      ]
    }
] as Grammar[]
  