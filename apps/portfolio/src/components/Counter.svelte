<script lang="ts">
let count = $state(0);

function increment() {
  count++;
}

function decrement() {
  count--;
}
</script>

<div class="flex items-center gap-4 p-4 border rounded-lg bg-card">
  <button 
    onclick={decrement}
    class="px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
  >
    -
  </button>
  
  <span class="text-lg font-medium">{count}</span>
  
  <button 
    onclick={increment}
    class="px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
  >
    +
  </button>
</div> 