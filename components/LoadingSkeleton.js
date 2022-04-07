import React from 'react'
import Skeleton from 'react-loading-skeleton'

const LoadingSkeleton = () => {
  return (
    <div>
      <div className="row">
        <div className="col-md-2 px-1 py-1">
          <Skeleton style={{ height: 300 }} />
        </div>
        <div className="col-md-5 px-1 py-1">
          <Skeleton style={{ height: 300 }} />
        </div>
        <div className="col-md-3 px-1 py-1">
          <Skeleton style={{ height: 300 }} />
        </div>
        <div className="col-md-2 px-1 py-1">
          <Skeleton style={{ height: 300 }} />
        </div>
      </div>
      <div className="row d-none d-md-flex">
        <div className="col-md-4 px-1 py-1">
          <Skeleton style={{ height: 300 }} />
        </div>
        <div className="col-md-3 px-1 py-1">
          <Skeleton style={{ height: 300 }} />
        </div>
        <div className="col-md-2 px-1 py-1">
          <Skeleton style={{ height: 300 }} />
        </div>
        <div className="col-md-3 px-1 py-1">
          <Skeleton style={{ height: 300 }} />
        </div>
      </div>
    </div>
  )
}

export default LoadingSkeleton