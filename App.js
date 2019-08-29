import React, { Component } from "react"

import SchemaLevel from "./components/SchemaLevel"

//  Unique ID's per level

// const schema = {
//   type: "object",
//   properties: {
//     name: {
//       type: "string"
//     },
// surname: {
//   type: "string"
// },
//     DOB: {
//       type: "integer"
//     },
//     ID: {
//       type: "double"
//     },
//     nestedObj: {
//       type: "object",
//       properties: {
//         name: {
//           type: "string"
//         },
//         surname: {
//           type: "string"
//         },
//         nestedObjInner: {
//           type: "object",
//           properties: {
//             name: {
//               type: "string"
//             },
//             surname: {
//               type: "string"
//             },
//             nestedObjInnerInner: {
//               type: "object",
//               properties: {
//                 name: {
//                   type: "string"
//                 },
//                 surname: {
//                   type: "string"
//                 },
//                 nestedObjInnerInnerDer: {
//                   type: "object",
//                   properties: {
//                     name: {
//                       type: "string"
//                     },
//                     surname: {
//                       type: "string"
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     },
//     nestedObjOuter: {
//       type: "object",
//       properties: {
//         name: {
//           type: "string"
//         },
//         surname: {
//           type: "string"
//         }
//       }
//     },
//     nestedObjOuter2: {
//       type: "object",
//       properties: {
//         name: {
//           type: "string"
//         },
//         surname: {
//           type: "string"
//         }
//       }
//     }
//   }
// }

export default class App extends Component {
  constructor(props) {
    super(props)
    this.bottomLevelUUID = this.uuid()
    this.state = {
      schema: {
        type: "object",
        uuid: this.bottomLevelUUID,
        properties: {}
      }
    }
  }

  mapSchema = (schema, id, mutatorFunc, additionalArgs) => {
    Object.keys(schema.properties).forEach(propertyKey => {
      let propertyItem = schema.properties[propertyKey]
      if (propertyItem.uuid === id) {
        mutatorFunc.apply({...additionalArgs, propertyItem: propertyItem.properties, context: this})
      } else {
        if (propertyItem.type === "object") {
          this.mapSchema(propertyItem, id, mutatorFunc)
        }
      }
    })
  }



  //  OBJECT RENDERING

  renderInnerObjects = (schemaObj, key) => {
    let toRender = []
    if (schemaObj.properties) {
      Object.keys(schemaObj.properties).forEach((key, index) => {
        let schemaItem = schemaObj.properties[key]
        if (schemaItem.type !== "object") {
          toRender.push(
            <SchemaLevel
              type={schemaItem.type}
              name={key}
              id={schemaItem.uuid}
              key={key + index}
              onAddField={this.onAddInnerField}
              onSetFieldType={this.onSetFieldType}
              onKeyUpdate={this.onKeyUpdate}
              handleFieldDelete={this.onDelete}
            />
          )
        } else {
          toRender.push(this.renderSchemaObject(schemaItem, key))
        }
      })
    }
    return (
      <SchemaLevel
        type={schemaObj.type}
        name={"root"}
        id={schemaObj.uuid}
        onAddField={this.onAddInnerField}
        onSetFieldType={this.onSetFieldType}
        onKeyUpdate={this.onKeyUpdate}
        handleFieldDelete={this.onDelete}
      >
        {toRender}
      </SchemaLevel>
    )
  }

  renderSchemaObject = (schemaObj, name) => {
    let toRender = []
    toRender.push(this.renderInnerObjects(schemaObj, name))
    return toRender
  }

  //  END OBJECT RENDERING

  //  KEY UPDATE

  updateKey = (properties, name, propertyKey) => {
    console.log(properties)
    Object.defineProperty(
      properties,
      name,
      Object.getOwnPropertyDescriptor(properties, propertyKey)
    )
    delete properties[propertyKey]
  }

  checkObjectKey = (properties, id, name) => {
    Object.keys(properties).forEach(propertyKey => {
      let propertyItem = properties[propertyKey]
      console.log(propertyKey)
      if (propertyItem.uuid === id) {
        this.updateKey(properties, name, propertyKey)
      } else {
        if (propertyItem.type === "object") {
          this.checkObjectKey(propertyItem.properties, id, name)
        }
      }
    })
  }

  onKeyUpdate = (id, name) => {
    console.log("Updating key")
    let { schema } = this.state
    Object.keys(schema.properties).forEach(propertyKey => {
      let propertyItem = schema.properties[propertyKey]
      if (propertyItem.uuid === id) {
        this.updateKey(schema.properties, name, propertyKey)
      } else {
        if (propertyItem.type === "object") {
          this.checkObjectKey(propertyItem.properties, id, name)
        }
      }
    })
    this.setState({ schema })
  }

  //  END KEY UPDATE

 

  //  ADD INNER FIELD

  addNewField () {
    const { propertyItem, context } = this
    propertyItem.properties[Object.keys(propertyItem.properties).length] = {
      type: "string",
      uuid: context.uuid()
    }
  }

  onAddInnerField = id => {
    let { schema } = this.state
    if (schema.uuid === id && schema.type === "object") {
      this.addNewField.apply({propertyItem: schema, context: this})
    } else {
      this.mapSchema(schema, id, this.addNewField, {propertyItem: schema})
    }
    this.setState({ schema })
  }

  //  END ADD INNER FIELD

  //  SET FIELD TYPE

  updateType ()  {
    const { propertyItem, type } = this
    if (propertyItem.type === "object" && type !== "object") {
      delete propertyItem.properties
      propertyItem.type = type
    } else {
      if (type === "object") {
        propertyItem.type = type
        propertyItem.properties = {}
      } else {
        propertyItem.type = type
      }
    }
  }

  // checkObjectType = (properties, id, type) => {
  //   Object.keys(properties).forEach(propertyKey => {
  //     let propertyItem = properties[propertyKey]
  //     if (propertyItem.uuid === id) {
  //       this.updateType(propertyItem, type)
  //     } else {
  //       if (propertyItem.type === "object") {
  //         this.checkObjectType(propertyItem.properties, id, type)
  //       }
  //     }
  //   })
  // }

  onSetFieldType = (id, type) => {
    console.log("Updating type")
    let { schema } = this.state
    if (schema.uuid === id) {
      this.updateType.apply({type, propertyItem: schema})
    } else {
      this.mapSchema(schema, id, this.updateType, {type})
      // Object.keys(schema.properties).forEach(propertyKey => {
      //   let propertyItem = schema.properties[propertyKey]
      //   if (propertyItem.uuid === id) {
      //     this.updateType(propertyItem, type)
      //   } else {
      //     if (propertyItem.type === "object") {
      //       this.checkObjectType(propertyItem.properties, id, type)
      //     }
      //   }
      // })
    }

    this.setState({ schema })
  }

  //  END SET FIELD TYPE

  //  REMOVE IDS

  jsonCopy = src => {
    return JSON.parse(JSON.stringify(src))
  }

  removeIdsInner = schema => {
    Object.keys(schema.properties).forEach(propertyKey => {
      let propertyItem = schema.properties[propertyKey]
      if (propertyItem.type === "object") {
        delete propertyItem.uuid
        this.removeIdsInner(propertyItem)
      } else {
        delete propertyItem.uuid
      }
    })
  }

  removeIds = schema => {
    let newSchema = this.jsonCopy(schema)
    Object.keys(newSchema.properties).forEach(propertyKey => {
      let propertyItem = newSchema.properties[propertyKey]
      if (propertyItem.type === "object") {
        delete propertyItem.uuid
        this.removeIdsInner(propertyItem)
      } else {
        delete propertyItem.uuid
      }
    })
    return newSchema
  }

  //  END REMOVE IDS

  onDelete = id => {
    console.log("Delete")
  }

  uuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  render() {
    const { schema } = this.state
    return (
      <div className="main-wrapper">
        <div className="inner-wrapper">{this.renderSchemaObject(schema)}</div>
        <div className="schema-container">
          <pre>
            <code>{JSON.stringify(schema, null, 2)}</code>
          </pre>
        </div>
      </div>
    )
  }
}
