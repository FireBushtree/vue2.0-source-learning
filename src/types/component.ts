import { ComponentOptions } from './options'

export interface Options {
  el?: string
  data?: () => object
}

export declare class Component {
  constructor(options: Options)
  $options: ComponentOptions

  _data: Record<string, any>
}
