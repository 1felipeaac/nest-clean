import { randomUUID } from 'node:crypto'
import { Entity } from './entity'

export class UniqueEntityID {
  private value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  public equals(id: UniqueEntityID){
    return id.toValue() === this.value
  }
}
