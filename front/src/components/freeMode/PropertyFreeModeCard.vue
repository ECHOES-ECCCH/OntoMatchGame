<script setup lang="ts"></script>

<template>
  <div class="carousel-container">
    <div class="property">
      <!-- LEFT FILTER -->
      <BranchesFilter
        :model-value="branches[`${totalCards.position}_domain`]"
        @update:model-value="
          $emit('update:branches', { position: `${totalCards.position}_domain`, value: $event })
        "
        orientation="vertical-left"
      />

      <div
        class="property-card"
        :class="[
          {
            wrong: Array.isArray(totalCards.cards)
              ? !totalCards.cards.some(
                  (c) => c?.id === cardInfo[totalCards.position as Position].id,
                )
              : false,
          },
          errorCards[totalCards.position]?.status === 'incorrect' ? 'error' : '',
        ]"
      >
        <!-- DOMAIN BUTTON -->
        <button
          class="vertical-button vertical-left"
          @click="
            switchCard(
              cardInfo[totalCards.position as Position]?.domain,
              totalCards.position,
              'domain',
            )
          "
          :style="handlePropertyColor(totalCards.position, 'domain')"
        >
          <span>Domain</span>
          <p>{{ cardInfo[totalCards.position as Position].domain }}</p>
        </button>

        <!-- CENTER CONTENT -->
        <div class="card-content">
          <!-- Scope Note -->
          <div v-if="showScopeNote" class="scope-note-text">
            <p>{{ cardInfo[totalCards.position as Position].comment }}</p>
            <button @click="showScopeNote = false">Close</button>
          </div>

          <!-- Normal Content -->
          <template v-else>
            <div class="property card-name">
              <span class="property prefix">
                {{ cardInfo[totalCards.position as Position].id }}
              </span>
              <span class="property name">
                {{ cardInfo[totalCards.position as Position]?.labels.en }}
              </span>
            </div>

            <PropertySuperpropertiesSubproperties
              :position="totalCards.position"
              :cardInfo="cardInfo"
              @update:cardInfo="handleCardInfoUpdate"
              :superSubProperties="superSubProperties"
              :propertyDataCards="propertyDataCards"
            />
            <div class="scope-note">
              <button
                v-if="cardInfo[totalCards.position as Position].comment"
                @click="showScopeNote = true"
              >
                Scope Note
              </button>
            </div>
          </template>
        </div>

        <!-- RANGE BUTTON -->
        <button
          class="vertical-button vertical-right"
          @click="
            switchCard(
              cardInfo[totalCards.position as Position]?.range,
              totalCards.position,
              'range',
            )
          "
          :style="handlePropertyColor(totalCards.position, 'range')"
        >
          <p>{{ cardInfo[totalCards.position as Position].range }}</p>
          <span>Range</span>
        </button>
      </div>

      <!-- RIGHT FILTER -->
      <BranchesFilter
        :model-value="branches[`${totalCards.position}_range`]"
        @update:model-value="
          $emit('update:branches', { position: `${totalCards.position}_range`, value: $event })
        "
        orientation="vertical-right"
      />
    </div>

    <!-- SLIDER -->
    <div class="range">
      <button
        :disabled="showSolution"
        :style="showSolution && 'cursor: not-allowed'"
        type="button"
        @click="handlePrevious(totalCards.position as Position, totalCards.cards as CardInfo[])"
      >
        -
      </button>

      <input
        type="range"
        min="0"
        :max="(totalCards.cards as CardInfo[])?.length - 1"
        class="slider"
        :style="showSolution && 'cursor: not-allowed'"
        :value="currentIndexes[totalCards.position]"
        @input="
          handleSliderChange(
            totalCards.position,
            Number(($event.target as HTMLInputElement).value),
            totalCards.cards as CardInfo[],
          )
        "
        :disabled="showSolution"
      />

      <div class="slider-buttons">
        <button
          :style="showSolution && 'cursor: not-allowed'"
          :disabled="showSolution"
          type="button"
          @click="handleNext(totalCards.position as Position, totalCards.cards as CardInfo[])"
        >
          +
        </button>
      </div>
    </div>

    <!-- COUNTER -->
    <div
      class="number"
      :class="{ active: index === currentIndexes[totalCards.position as Position] }"
      v-for="(card, index) in totalCards.cards"
      :key="index"
    >
      {{ (totalCards.cards as CardInfo[]).length }}/{{ totalCards.totalCards }}
    </div>
  </div>
</template>
