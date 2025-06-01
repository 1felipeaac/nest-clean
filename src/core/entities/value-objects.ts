
export class ValueObjects<Props> {
  protected props: Props


  protected constructor(props: Props) {
    this.props = props
  }

  public equals(vo: ValueObjects<any>){
    if(vo === null || vo === undefined){
      return false
    }

    if(vo.props === undefined){
        return false
    }



    return JSON.stringify(vo.props) === JSON.stringify(this.props)
  }
}
