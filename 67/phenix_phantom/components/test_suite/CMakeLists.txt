idf_component_register(SRCS "test_suite.cpp"
                       INCLUDE_DIRS "."
                       REQUIRES unity driver esp_lcd esp_rom esp_lcd_axs15231b esp_timer
                       PRIV_REQUIRES main  # Access to main component headers
                       )

# Add compile definitions for test builds
target_compile_definitions(${COMPONENT_LIB} PRIVATE
    TEST_BUILD=1
)