import type { ParamsDictionary, RequestHandler } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import type { FactoryFunction, LayoutData } from '@rune-ts/server';

export interface LocalsType {
  layoutData: LayoutData;
  is_mobile: boolean;
}

export type RenderHandlerType<
  C,
  LocalsObj extends Record<string, any> & LocalsType = Record<string, any> & LocalsType,
  P = ParamsDictionary,
  ReqBody = any,
  ReqQuery = ParsedQs,
> = (view: FactoryFunction<C>) => RequestHandler<P, any, ReqBody, ReqQuery, LocalsObj>;
