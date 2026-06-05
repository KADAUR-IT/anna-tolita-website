import Image from 'next/image'
import React from 'react'

export const Logo = () => (
  <div className="flex justify-center mt-4 text-(--color-lila) m-2">
    <Image
      src="/assets/logo/logo_anna_tolila.png"
      alt="Logo Anna Tolila"
      width={201}
      height={106}
      className="h-[80px] w-auto"
    />
  </div>
)
