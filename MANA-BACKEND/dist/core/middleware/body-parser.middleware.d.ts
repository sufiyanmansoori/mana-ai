import express from 'express';
export declare function bodyParserMiddleware(options?: Parameters<typeof express.json>[0]): import("connect").NextHandleFunction;
