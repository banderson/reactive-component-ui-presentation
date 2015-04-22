# <em class="highlight">Functional > OO</em>

Problem: You need data from external source, but you want to encapsulate how it's retreived

## The OO Way: Create a mixin

### Problems:
* Clashes
    - `shouldComponentUpdate` --> does this no longer work?
    - Having state names the same as others
* You need to understand internals of other mixins

### Solution: Create a wrapper component!

### Benefits:
 - You get your own component lifecycle
 - No worry of conflicts

### Limitations:
- You cannot access internal state or instance methods(is this good?)
- So PureRenderMixin, etc. cannot use this

### Recommendation:
- Any extension that needs access to internal state, use mixin (or base class in the future?)
- For all other cases, and when that internal state can be converted to props, use HOC
- Example: highlight renders, cannot easily be converted

note:
    Remember Declarative vs Imperative?
