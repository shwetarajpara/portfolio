import useTextScramble from '../lib/useTextScramble'

/**
 * Renders `text` decoding in from random characters once visible.
 * `as` controls the element tag; className/style pass through.
 */
export default function ScrambleHeading({ text, as: Tag = 'span', className = '', speed = 22 }) {
  const [ref, display] = useTextScramble(text, { speed })
  return (
    <Tag ref={ref} className={className}>
      {display}
    </Tag>
  )
}
