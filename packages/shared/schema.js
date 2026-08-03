"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.updatePasswordSchema = exports.updatePaymentStatusSchema = exports.updatePaymentSchema = exports.createPaymentSchema = exports.paymentStatusSchema = exports.paymentMethodSchema = exports.updateInvoiceStatusSchema = exports.updateInvoiceSchema = exports.createInvoiceSchema = exports.invoiceStatusSchema = exports.updateQuotationStatusSchema = exports.updateQuotationSchema = exports.createQuotationSchema = exports.updateServiceSchema = exports.createServiceSchema = exports.updateCategorySchema = exports.createCategorySchema = exports.updateCustomerSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
// Customer Schemas
exports.createCustomerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters"),
        email: zod_1.z
            .string()
            .email("Invalid email format")
            .optional()
            .or(zod_1.z.literal("")),
        phone: zod_1.z
            .string()
            .min(10, "Phone number must be at least 10 characters")
            .max(15, "Phone number must not exceed 15 characters"),
        address: zod_1.z
            .string()
            .max(500, "Address must not exceed 500 characters")
            .optional(),
        gstNumber: zod_1.z
            .string()
            .max(15, "GST number must be exactly 15 characters")
            .optional(),
        notes: zod_1.z
            .string()
            .max(1000, "Notes must not exceed 1000 characters")
            .optional(),
    }),
});
exports.updateCustomerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters")
            .optional(),
        email: zod_1.z
            .string()
            .email("Invalid email format")
            .optional()
            .or(zod_1.z.literal("")),
        phone: zod_1.z
            .string()
            .min(10, "Phone number must be at least 10 characters")
            .max(15, "Phone number must not exceed 15 characters")
            .optional(),
        address: zod_1.z
            .string()
            .max(500, "Address must not exceed 500 characters")
            .optional(),
        gstNumber: zod_1.z
            .string()
            .length(15, "GST number must be exactly 15 characters")
            .optional()
            .or(zod_1.z.literal("")),
        notes: zod_1.z
            .string()
            .max(1000, "Notes must not exceed 1000 characters")
            .optional(),
    }),
});
// Category Schemas
exports.createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters"),
        description: zod_1.z
            .string()
            .max(500, "Description must not exceed 500 characters")
            .optional(),
    }),
});
exports.updateCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters")
            .optional(),
        description: zod_1.z
            .string()
            .max(500, "Description must not exceed 500 characters")
            .optional(),
    }),
});
// Service Schemas
exports.createServiceSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(200, "Name must not exceed 200 characters"),
        description: zod_1.z
            .string()
            .max(1000, "Description must not exceed 1000 characters")
            .optional(),
        categoryId: zod_1.z.string().optional(),
        unit: zod_1.z.string().max(50, "Unit must not exceed 50 characters").optional(),
        price: zod_1.z.number().positive("Price must be positive"),
        taxRate: zod_1.z
            .number()
            .min(0, "Tax rate cannot be negative")
            .max(100, "Tax rate cannot exceed 100")
            .optional(),
    }),
});
exports.updateServiceSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(200, "Name must not exceed 200 characters")
            .optional(),
        description: zod_1.z
            .string()
            .max(1000, "Description must not exceed 1000 characters")
            .optional(),
        categoryId: zod_1.z.string().optional(),
        unit: zod_1.z.string().max(50, "Unit must not exceed 50 characters").optional(),
        price: zod_1.z.number().positive("Price must be positive").optional(),
        taxRate: zod_1.z
            .number()
            .min(0, "Tax rate cannot be negative")
            .max(100, "Tax rate cannot exceed 100")
            .optional(),
    }),
});
// Quotation Schemas
exports.createQuotationSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string().min(1, "Customer is required"),
        issueDate: zod_1.z.string().optional(),
        expiryDate: zod_1.z.string().optional(),
        discount: zod_1.z.number().min(0).max(100).optional(),
        tax: zod_1.z.number().min(0).max(100).optional(),
        notes: zod_1.z
            .string()
            .max(1000, "Notes must not exceed 1000 characters")
            .optional(),
        termsConditions: zod_1.z
            .string()
            .max(2000, "Terms & Conditions must not exceed 2000 characters")
            .optional(),
        items: zod_1.z
            .array(zod_1.z.object({
            serviceId: zod_1.z.string().min(1, "Service is required"),
            description: zod_1.z
                .string()
                .max(500, "Description must not exceed 500 characters")
                .optional(),
            quantity: zod_1.z.number().min(1, "Quantity must be at least 1"),
            unitPrice: zod_1.z.number().positive("Unit price must be positive"),
            taxRate: zod_1.z.number().min(0).max(100).optional(),
            discount: zod_1.z.number().min(0).max(100).optional(),
        }))
            .min(1, "At least one item is required"),
    }),
});
exports.updateQuotationSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string().min(1, "Customer is required").optional(),
        issueDate: zod_1.z.string().optional(),
        expiryDate: zod_1.z.string().optional(),
        discount: zod_1.z.number().min(0).max(100).optional(),
        tax: zod_1.z.number().min(0).max(100).optional(),
        notes: zod_1.z
            .string()
            .max(1000, "Notes must not exceed 1000 characters")
            .optional(),
        termsConditions: zod_1.z
            .string()
            .max(2000, "Terms & Conditions must not exceed 2000 characters")
            .optional(),
        status: zod_1.z
            .enum(["DRAFT", "SENT", "APPROVED", "REJECTED", "EXPIRED"])
            .optional(),
        items: zod_1.z
            .array(zod_1.z.object({
            serviceId: zod_1.z.string().min(1, "Service is required"),
            description: zod_1.z
                .string()
                .max(500, "Description must not exceed 500 characters")
                .optional(),
            quantity: zod_1.z.number().min(1, "Quantity must be at least 1"),
            unitPrice: zod_1.z.number().positive("Unit price must be positive"),
            taxRate: zod_1.z.number().min(0).max(100).optional(),
            discount: zod_1.z.number().min(0).max(100).optional(),
        }))
            .optional(),
    }),
});
exports.updateQuotationStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["DRAFT", "SENT", "APPROVED", "REJECTED", "EXPIRED"]),
    }),
});
// Invoice Schemas
exports.invoiceStatusSchema = zod_1.z.enum([
    "DRAFT",
    "SENT",
    "PARTIALLY_PAID",
    "PAID",
    "OVERDUE",
    "CANCELLED",
]);
exports.createInvoiceSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string().min(1, "Customer is required"),
        quotationId: zod_1.z.string().optional(),
        issueDate: zod_1.z.string().optional(),
        dueDate: zod_1.z.string().optional(),
        discount: zod_1.z.number().min(0).max(100).optional(),
        tax: zod_1.z.number().min(0).max(100).optional(),
        notes: zod_1.z
            .string()
            .max(1000, "Notes must not exceed 1000 characters")
            .optional(),
        termsConditions: zod_1.z
            .string()
            .max(2000, "Terms & Conditions must not exceed 2000 characters")
            .optional(),
        items: zod_1.z
            .array(zod_1.z.object({
            serviceId: zod_1.z.string().min(1, "Service is required"),
            description: zod_1.z
                .string()
                .max(500, "Description must not exceed 500 characters")
                .optional(),
            quantity: zod_1.z.number().min(1, "Quantity must be at least 1"),
            unitPrice: zod_1.z.number().positive("Unit price must be positive"),
            taxRate: zod_1.z.number().min(0).max(100).optional(),
            discount: zod_1.z.number().min(0).max(100).optional(),
        }))
            .min(1, "At least one item is required"),
    }),
});
exports.updateInvoiceSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string().min(1, "Customer is required").optional(),
        quotationId: zod_1.z.string().optional(),
        issueDate: zod_1.z.string().optional(),
        dueDate: zod_1.z.string().optional(),
        discount: zod_1.z.number().min(0).max(100).optional(),
        tax: zod_1.z.number().min(0).max(100).optional(),
        notes: zod_1.z
            .string()
            .max(1000, "Notes must not exceed 1000 characters")
            .optional(),
        termsConditions: zod_1.z
            .string()
            .max(2000, "Terms & Conditions must not exceed 2000 characters")
            .optional(),
        status: exports.invoiceStatusSchema.optional(),
        items: zod_1.z
            .array(zod_1.z.object({
            serviceId: zod_1.z.string().min(1, "Service is required"),
            description: zod_1.z
                .string()
                .max(500, "Description must not exceed 500 characters")
                .optional(),
            quantity: zod_1.z.number().min(1, "Quantity must be at least 1"),
            unitPrice: zod_1.z.number().positive("Unit price must be positive"),
            taxRate: zod_1.z.number().min(0).max(100).optional(),
            discount: zod_1.z.number().min(0).max(100).optional(),
        }))
            .optional(),
    }),
});
exports.updateInvoiceStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: exports.invoiceStatusSchema,
    }),
});
// Payment Schemas
exports.paymentMethodSchema = zod_1.z.enum([
    "CASH",
    "BANK_TRANSFER",
    "UPI",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "PAYPAL",
    "OTHER",
]);
exports.paymentStatusSchema = zod_1.z.enum([
    "PENDING",
    "COMPLETED",
    "FAILED",
    "REFUNDED",
]);
exports.createPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        invoiceId: zod_1.z.string().min(1, "Invoice is required"),
        amount: zod_1.z.number().positive("Amount must be positive"),
        paymentMethod: exports.paymentMethodSchema,
        paymentDate: zod_1.z.string().optional(),
        transactionNumber: zod_1.z
            .string()
            .max(100, "Transaction number must not exceed 100 characters")
            .optional(),
        notes: zod_1.z
            .string()
            .max(500, "Notes must not exceed 500 characters")
            .optional(),
    }),
});
exports.updatePaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive("Amount must be positive").optional(),
        paymentMethod: exports.paymentMethodSchema.optional(),
        paymentDate: zod_1.z.string().optional(),
        transactionNumber: zod_1.z
            .string()
            .max(100, "Transaction number must not exceed 100 characters")
            .optional(),
        notes: zod_1.z
            .string()
            .max(500, "Notes must not exceed 500 characters")
            .optional(),
        status: exports.paymentStatusSchema.optional(),
    }),
});
exports.updatePaymentStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: exports.paymentStatusSchema,
    }),
});
exports.updatePasswordSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        currentPassword: zod_1.z.string().min(1, "Current password is required"),
        newPassword: zod_1.z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: zod_1.z.string().min(1, "Confirm password is required"),
    })
        .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    }),
});
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Full name is required"),
        email: zod_1.z.string().email("Please enter a valid email address"),
    }),
});
